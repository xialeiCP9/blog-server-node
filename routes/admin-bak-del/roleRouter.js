module.exports = router => {
  const Permission = require('../../models/Permission')
  const Role = require('../../models/Role')

  // 获取全部权限
  router.get('/permission', async (req, res) => {
    try {
      const result = await Permission.find()
      res.send({
        code: 0,
        data: result
      })
    } catch (err) {
      console.log('获取权限出错', err)
      res.send({
        code: 1,
        msg: '权限获取出错，请刷新重试'
      })
    }
  })
  // 获取全部角色
  router.get('/role', async (req, res) => {
    try {
      const result = await Role.find()
      res.send({
        code: 0,
        data: result
      })
      return
    } catch (err) {
      console.log("获取角色失败", err)
      res.send({
        code: 1,
        msg: '角色获取失败，请刷新重试'
      })
    }
  })

  // 增加角色
  router.post('/role', (req, res) => {
    const role = new Role({
      ...req.body
    })
    role.save((err, data) => {
      if (err) {
        console.log('角色保存失败', err)
        res.send({
          code: 1,
          msg: '角色添加失败'
        })
        return
      }
      res.send({
        code: 0,
        data: {
          msg: '角色添加成功'
        }
      })
    })
  })

  //编辑角色
  router.put('/role', (req, res) => {
    const {_id} = req.body
    Role.findByIdAndUpdate(_id, {$set: {...req.body}}, (err, data) => {
      if (err) {
        console.log('角色更新失败', err)
        res.send({
          code: 1,
          msg: '角色更新失败'
        })
        return
      }
      res.send({
        code: 0,
        data: {
          msg: '角色更新成功'
        }
      })
    })
  })
}