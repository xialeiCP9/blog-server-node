module.exports = app => {

  const router = require('express').Router({
    mergeParams: true
  })
  require('express-async-errors') // express不能捕获Promise异常搞了个破解包，因此需该包
  const assert = require('http-assert') //断点
  const jwt = require('jsonwebtoken')
  const authMiddleware = require('../../middleware/authMiddleware')

  const User = require('../../models/User')

  const checkMail = {}

  // 登录
  app.post('/admin/api/login', async (req, res) => {
    /* 获取用户名和密码 */
    const { username, password } = req.body
    /* 查找数据库 */
    const user = await User.findOne({username}).select('+password')
    /* 用户名不存在时，返回 */
    assert(user, 401, '用户名不存在')
    let isValid = false;
    isValid = require('bcrypt').compareSync(password, user.password)
    //密码不正确
    assert(isValid, 401, '用户名或密码错误')
    // 返回token
    const token = jwt.sign({_id: user._id}, app.get('secret'))
    res.send({
      code: 0,
      data:{
        msg: '登录成功',
        token: token
      }
    })
  })

  //注册
  app.post('/admin/api/register', async (req, res) => {
    /* 查询出用户的默认角色 */
    const result = await require("../../models/Role").findOne({isDefault: true})
    if (result) {
      req.body.role = result._id
    }
    /* 存入数据库 */
    User.create(req.body, async (err, result) => {
      if (err) {
        console.log("注册失败", err)
        return res.status(404).send({
          code: 1,
          msg: '服务器错误'
        })
      }
      /* 注册成功后，要返回对应的token */
      /* 查找出刚刚添加的user */
      const user = await User.findOne({username: req.body.username})
      /* 计算出token */
      const token = jwt.sign({_id: user._id}, app.get('secret'))
      res.send({
        code: 0,
        data: {
          msg: '注册成功',
          token: token
        }
      })
    })
  })
  //检测注册时用户名是否已存在
  app.post('/admin/api/repeatability', async (req, res) => {
    const { username }= req.body
    try {
      const result = await User.findOne({username})
      res.send({
        code: 0,
        data: {
          msg: result ? '用户名已存在' : '用户名不存在',
          isExit: !!result
        }
      })
    } catch (err) {
      console.log("用户重复性检测错误", err)
      res.status(500).send({
        code: 1,
        msg: '服务器错误，请刷新后重试'
      })
    }
  })
  // 根据token获取用户信息
  app.post('/admin/api/authtoken', async (req, res) => {
    const {token} = req.body
    let admin = null
    try {
      admin = jwt.verify(token, app.get('secret'))
    } catch (err) {
      assert(admin, 401, '请先登录')
    }
    const user = await User.findById(admin._id)
    assert(user, 401, '请先登录')
    res.send({
      code: 0,
      data: {
        token,
        user
      }
    })
  })
  // 使用邮箱进行验证
  app.post('/admin/api/sendmail', (req, res) => {
    const {email, username, _id} = req.body
    const token = jwt.sign({_id: _id}, app.get('secret'))
    console.log('sendmail() token', token)
    const url = `http://localhost:3000/admin/api/emailcheck/${token}`
    require('../../utils/sendMail')({
      email,
      subject: '【React 博客】Email 地址验证',
      html: `
        <p>Email地址验证<p>
        <div style="borderRadius: 6px; boxShadow: 0 0 0 3px #f2f2f2">
          <header style=
            "height: 25px;padding: 15px 35px;lineHeight: 25px; boxSizing: border-box; background: #F75733;fontWeight: bold;fontSize: 18px;color: white;"
          >
           React博客Email地址验证
          </header>
          <section>
            <p>${username},</p>
            <p>这封信是由 React博客 发送的</p>
            <br/>
            <p>您收到这封邮件，是由于在 React博客 修改了密码 使用了这个邮箱地址，如果您没有访问过
               React博客，或没有进行上述操作，请忽略这封邮件。您不需要退订或进行其他进一步的操作
            </p>
            <br/>
            <p>
              如果您是 React博客的用户，并且准备修改密码，我们需要对您的地址有效性进行验证，确保是您本人进行密码修改
            </p>
            <p>
              您只需点击下面的链接即可修改密码:
            </p>
            <a href="${url}">${url}</a>
            <p>(如果上面不是链接形式，请将该地址手工粘贴到浏览器地址栏再访问)</p>
            <p>感谢您的访问，祝您使用愉快！</p>
            <p>此致</p>
            <p>React博客 管理团队.</p>
          </section>
        </div>
      `
    }).then(resp => {
      res.send({
        code: 0,
        data: {
          msg: '邮件已发送到邮箱，请在邮箱确认后再修改密码'
        }
      })
    }).catch(err => {
      console.log('发送邮件错误', err)
      res.status(500).send({
        code: 1,
        msg: '服务器错误'
      })
    })
  })

  app.get('/admin/api/emailcheck/:token', async (req, res) => {
    const { token } = req.params
    let admin = null
    try{
      admin = jwt.verify(token, app.get('secret'))
      console.log('admin', admin)
    }catch(err){
      console.log('jwt解析失败', err)
      assert(admin, 401, '没有登录，请先登录')
    }
    const user = await User.findById(admin._id)
    assert(user, 401, '请先登录')
    checkMail[user._id] = true
    res.send({
      code: 0,
      data: {
        token,
        user,
        msg: "激活成功"
      }
    })
  })

  app.get('/admin/api/check/:id', (req, res) => {
    // 查看用户是否点击了邮件链接
    const {id} = req.params
    if (checkMail[id]) {
      delete checkMail[id]
      res.send({
        code: 0,
        data: {
          isActive: true,
          msg: "邮件已激活"
        }
      })
      return
    }
    res.status(403).send({
      code: 1,
      msg: "没有激活邮箱"
    })
  })

  // 修改密码
  app.post('/admin/api/changepwd', async (req, res) => {
    const {username, password, newPassword} = req.body
    try {
      /* 查找数据库 */
      const user = await User.findOne({username}).select('+password')
      /* 用户名不存在时，返回 */
      assert(user, 401, '用户名不存在')
      let isValid = false;
      isValid = require('bcrypt').compareSync(password, user.password)
      //密码不正确
      assert(isValid, 401, '原密码错误')
      User.findByIdAndUpdate(user._id, {password: newPassword}, (err, data) => {
        if (err) {
          return res.status(500).send({
            code: 1,
            msg: '数据查询失败'
          })
        }
        res.send({
          code: 0,
          data: {
            msg: '更新成功',
            data: data
          }
        })
      })
    }catch(err) {
      console.log(err.msg)
      return res.status(500).send({
        code: 1,
        msg: "服务器错误，请刷新后重试"
      })
    }
  })
  // 根据ID获取数据
  router.get('/:id', async(req, res) => {
    console.log('执行到我这里')
    const { id } = req.params
    try {
      const data = await req.Model.findById(id)
      res.send({
        code: 0,
        data: {
          msg: '查询成功',
          data
        }
      })
    }catch(err) {
      console.log(`查询${req.Model}失败`, err)
      res.status(500).send({
        code: 1,
        msg: '服务器错误'
      })
    }
    
  })
  // 获取数据
  router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) // 多页查询
    const page = parseInt(req.query.page)
    let filter = {} // 其它条件查询
    for (let key in req.query) {
      switch (key) {
        case '_id':
          filter._id = req.query._id
          break;
        case 'text': //针对文章列表模糊查询
          const regExp = new RegExp(req.query.text, 'ig')
          filter['$or'] = [
            {title: regExp},
            {desc: regExp}
          ]
          break;
        case 'categoryIds': //针对文章目录查询
          filter['category'] = {$in: req.query.categoryIds}
          break
        case 'name': // 名称查询
          const nameRegExp = new RegExp(req.query.name, 'ig')
          filter['name'] = {name: nameRegExp}
          break
        default:
          break
      }
    }
    try {
      const total = await req.Model.countDocuments(filter)
      const list = await req.Model.find(filter).skip(limit * (page - 1)).limit(limit).select('-content')
      res.send({
        code: 0,
        data: {
          msg: '查询成功',
          total,
          data: list
        }
      })
    } catch (err) {
      console.log(`查询${req.Model}失败`, err)
      res.status(500).send({
        code: 1,
        msg: '服务器错误'
      })
    }
  })
  // 增加数据
  router.post('/', async (req, res) => {
    console.log('post req.body', req.body)
    const model = new req.Model({
      ...req.body
    })
    model.save((err, data) => {
      if (err) {
        console.log(`${req.Model}增加失败`, err)
        return res.status(500).send({
          code: 1,
          msg: '新增失败'
        })
      }
      console.log('增加成功', data)
      res.send({
        code: 0,
        data: {
          msg: '新增成功',
          data: data
        }
      })
    })
  })
  //删除数据
  router.delete('/:id', async (req, res) => {
    const { id } = req.params
    switch (req.resource) {
      case 'Category':
        // 删除目录，要确保自己没有子目录，且没有文章使用
        const result = await req.Model.find({parent: id})
        if (result.length > 0) {
          return res.status(403).send({
            code: 1,
            msg: '该目录下有子目录，请先删除子目录'
          })
        }
        const list = await require('../../models/Article').find({category: id})
        if (list.length > 0) {
          return res.status(403).send({
            code: 1,
            msg: '该目录下存在文章，请先删除文章'
          })
        }
        break;
      case 'Role':
        const users = await require('../../models/User').find({role: id})
        if (users.length > 0) {
          return res.status(403).send({
            code: 1,
            msg: '存在使用该角色的用户，请先修改用户角色'
          })
        }
      default:
        break;
    }
    // 删除数据，需要查看数据有没有被使用
    req.Model.findByIdAndRemove(id, (err, data) => {
      if (err) {
        return res.status(500).send({
          code: 1,
          msg: '删除失败'
        })
      }
      res.send({
        code: 0,
        data: {
          msg: '删除成功',
          data: data
        }
      })
    })
  })
  //编辑
  router.put('/', async (req, res) => {
    const { _id } = req.body
    req.Model.findByIdAndUpdate(_id, {$set: {...req.body, updateAt: new Date().getTime()}}, (err, data) => {
      if (err) {
        return res.status(500).send({
          code: 1,
          msg: '数据更新失败'
        })
      }
      req.Model.findById(data._id, (err, data) => {
        if (err) {
          return res.status(500).send({
            code: 1,
            msg: '数据查询失败'
          })
        }
        res.send({
          code: 0,
          data: {
            msg: '更新成功',
            data: data
          }
        })
      })
    })
  })

  /* 图片上传接口 */
  const multer = require('multer')
  const upload = multer({dest: __dirname + '/../../uploads'})
  const mime = require('mime')
  const fs = require('fs')
  app.post('/admin/api/upload', authMiddleware({app, User}), upload.single('file'), (req, res) => {
    const file = req.file
    /* 获取图片扩展名 */
    const extension = mime.getExtension(file.mimetype)
    /* 读取图片并更新图片名称 */
    fs.rename(file.path, file.path + '.' + extension, err => {
      if (err) {
        console.log('上传图片失败', err)
        return res.status(500).send({
          code: 0,
          msg: '服务器出错，图片上传失败'
        })
      }
      file.url = 'http://localhost:3000/' + file.filename + '.' + extension
      file.filename = file.filename + '.' + extension
      res.send({
        code: 0,
        data: {
          msg: '图片上传成功',
          file
        }
      })
    })
  })

  app.use('/admin/api/rest/:resource', authMiddleware({app, User}), (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require('../../models/' + modelName)
    req.resource = modelName
    next()
  }, router)

  // 错误处理函数
  app.use((err, req, res, next) => {
    console.log('正在进入错误处理函数')
    res.status(err.status || 500).send({
      msg: err.message,
      code: 1
    })
  })
}