module.exports = app => {
  const mongoose = require('mongoose')
  const router = require('express').Router()
  const User = require('../../models/User')
  const Role = require('../../models/Role')
  const jwt = require('jsonwebtoken')
  const multer = require('multer')
  const authMiddleware = require('../../middleware/authMiddleware')
  const articleRouter = require('./articleRouter')
  const categoryRouter = require('./categoryRouter')
  const roleRouter = require('./roleRouter')
  const userRouter = require('./userRouter')
  /* 注册 */
  app.post('/api/admin/register', async (req, res) => {
    /* 查询出用户的默认角色 */
    const result = await Role.findOne({isDefault: true})
    if (result) {
      req.body.role = result._id
    }
    /* 存入数据库 */
    User.create(req.body, async (err, result) => {
      if (err) {
        res.send({
          code: 1,
          msg: '服务器错误,请刷新后重试'
        })
        return
      }
      /* 注册成功后，要返回对应的token */
      /* 查找出刚刚添加的user */
      const user = await User.findOne({username: req.body.username})
      /* 计算出token */
      const token = jwt.sign({_id: user._id}, app.get('secret'))
      res.send({
        code: 0,
        msg: '注册成功',
        data: {
          token
        }
      })
    })
  })
  //登录
  app.post('/api/admin/login', async (req, res) => {
    /* 获取用户名和密码 */
    const { username, password } = req.body
    /* 查找数据库 */
    const user = await User.findOne({username}).select('+password')
    /* 用户名不存在时，返回 */
    if (!user) {
      res.send({
        code: 1,
        msg: '用户名或密码不正确'
      })
      return;
    }

    /* 用户已被注销时 */
    if (!user.isValid) {
      res.send({
        code: 1,
        msg: '对不起，该用户已被禁用'
      })
    }

    /* 用户名存在时，比较密码（sha256） */
    if (require('bcrypt').compareSync(password, user.password)) {
      // 计算token
      const token = jwt.sign({_id: user._id}, app.get('secret'))
      res.send({
        code: 0,
        data: {
          token: token
        }
      })
      return
    } else {
      res.send({
        code: 1,
        msg: '用户名或密码不正确'
      })
      return
    }

  })
  //验证用户名是否存在
  app.post('/api/admin/validate', async (req, res) => {
    const { username } = req.body
    try {
      const result = await User.find({username})
      res.send({
        code: 0,
        data: result.length
      })
    } catch (err) {
      res.send({
        code: 1,
        msg: '服务器错误，请刷新后重试'
      })
    }
  })
  userRouter(router)
  articleRouter(router)
  categoryRouter(router)
  roleRouter(router)
  /* 图片上传接口 */
  const upload = multer({dest: __dirname + '/../../uploads'})
  const mime = require('mime')
  const fs = require('fs')
  router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file
    /* 获取图片扩展名 */
    const extension = mime.getExtension(file.mimetype)
    /* 读取图片并更新图片名称 */
    fs.rename(file.path, file.path + '.' + extension, err => {
      if (err) {
        console.log('上传图片失败', err)
        res.send({
          code: 1,
          msg: '上传文件失败'
        })
        return
      }
      file.url = 'http://localhost:3000/' + file.filename + '.' + extension
      file.filename = file.filename + '.' + extension
      res.send({
        code: 0,
        data: {
          file
        }
      })
    })
  })
  app.use('/api/admin', authMiddleware({User, app}), router)
}