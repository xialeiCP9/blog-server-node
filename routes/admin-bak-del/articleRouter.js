module.exports = router => {
  const Article = require('../../models/Article')
  /* 根据文章id获取文章 */
  router.get('/articles/:id', async (req, res) => {
    const { id } = req.params
    try {
      const article = await Article.findById(id)
      res.send({
        code: 0,
        data: article
      })
    } catch (err) {
      console.log('获取文章内容出错', err)
      res.send({
        code: 1,
        msg: '服务器错误，请刷新后重试'
      })
    }
  })

  /* 添加文章 */
  router.post('/articles', async (req, res) => {
    const article = req.body
    const articleEntity = new Article({
      ...article
    })
    articleEntity.save((err, data) => {
      if (err) {
        res.send({
          code: 1,
          msg: '服务器错误，请刷新后重试'
        })
        return
      }
      res.send({
        code: 0,
        data: {
          msg: '文章新增成功'
        }
      })
    })
  })

  /* 获取文章列表 */
  router.get('/articles', async (req, res) => {
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const text = req.query.text || ''
    const regex = new RegExp(text, 'i')
    const categories = req.query.categories
    const filter = {
      $or: [
        {title: regex},
        {desc: regex}
      ]
    }
    if (categories) {
      filter['category'] = {$in: categories}
    }
    
    try {
      const articleList = await Article.find(filter).skip((page - 1) * limit).limit(limit).select('-content')
      const total = await Article.countDocuments(filter)
      res.send({
        code: 0,
        data: {articleList, total}
      })
    } catch (err) {
      console.log('获取文章错误', err)
      res.send({
        code: 1,
        msg: '服务器错误，请刷新后重试'
      })
    }
  })

  /* 更新文章 */
  router.put('/articles', (req, res) => {
    const {_id} = req.body
    Article.findByIdAndUpdate(_id,
        {...req.body, updateAt: new Date().getTime()},
        (err, data) => {
      if (err) {
        console.log('更新文章失败', err)
        res.send({
          code: 1,
          msg: '服务器错误，请刷新后重试'
        })
        return
      }
      res.send({
        code: 0,
        data: {
          msg: '更新成功'
        }
      })
    })
  })
  /* 删除文章 */
  router.delete('/articles/:id', (req, res) => {
    const {id} = req.params
    Article.findByIdAndRemove(id, (err, data) => {
      if (err) {
        res.send({
          code: 1,
          msg: '删除失败，请刷新重试'
        })
        return
      }
      res.send({
        code: 0,
        data: {
          msg: '删除成功'
        }
      })
    })
  })
}