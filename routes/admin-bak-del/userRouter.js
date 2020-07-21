module.exports = router => {
  const User = require('../../models/User')
  /* 获取登录用户信息 */
  router.get('/userInfo', async (req, res) => {
    res.send({
      code: 0,
      data: req.user
    })
  })

  /* 获取全部用户 */
  router.get('/users', async (req, res) => {
    try {
      const result = await User.find()
      res.send({
        code: 0,
        data: result
      })
    } catch (err) {
      console.log('获取全部用户失败', err)
      res.send({
        code: 1,
        msg: '获取用户失败，请刷新后重试'
      })
    }
  })

  /* 更新用户信息 */
  router.put('/users', (req, res) => {
    const user = req.body
    User.findByIdAndUpdate(user._id, {$set: {...user}}, (err, data) => {
      if (err) {
        console.log('更新用户信息失败:', err)
        res.send({
          code: 1,
          msg: '更新用户信息失败，请刷新后重试'
        })
        return
      }
      res.send({
        code: 0,
        data: {
          msg: `更新用户${data.username}的数据成功`
        }
      })
    })
  })
}