/* 登录校验中间件 */
module.exports = options => {
  const {User, app} = options
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  return async (req, res, next) => {
    /* 获取headers中的token信息 */
    const authorization = req.headers.authorization
    /*if (!authorization) {
      res.send({
        code: 1,
        msg: '请先登录'
      })
      return
    }*/
    assert(authorization, 401, '没有登录，请先登录')
    const token = authorization.split(' ').pop()
    /* 对token进行验证 */
    let admin = null
    try{
      admin = jwt.verify(token, app.get('secret'))
    }catch(err){
      console.log('jwt解析失败', err)
      assert(admin, 401, '没有登录，请先登录')
    }
    //通过id查找到对应的user并返回
    const user = await User.findById(admin._id)
    /*if (!user) {
      res.send({
        code: 1,
        msg: '请先登录'
      })
      return
    }*/
    assert(user, 401, '没有登录，请先登录')
    req.user = user
    next()
  }
}