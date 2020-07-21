const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

/* 连接数据库 */
require('./plugins')(app)

/* 读取环境变量 */
app.set('secret', process.env.BLOG_SECRET)

/* 解决跨域问题 */
/*app.use(require('cors')())*/

/* 解析post请求体 */
app.use(bodyParser.json())

/* 加载路由 */
require('./routes/admin')(app)

/* 静态文件 */
app.use(express.static(path.join(__dirname, 'uploads')))

app.listen(3000, function () {
  console.log('服务运行在3000端口')
})
