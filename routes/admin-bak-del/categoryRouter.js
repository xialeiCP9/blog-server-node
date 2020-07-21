module.exports = router => {
  const Category = require('../../models/Category')
  /* 根据父目录ID获取子目录 */
  router.get('/categories/:parent', async (req, res) => {
      const { parent } = req.params

      let result = []
      if (parent !== '-1') {
        result = await Category.aggregate([
          {$match: {parent: mongoose.Types.ObjectId(parent)}},
          {$lookup: {from: 'categories', localField: '_id', foreignField: 'parent', as: 'subCategories'}}
        ])
      } else {
        result = await Category.aggregate([
          {$match: {parent: {$exists: false}}},
          {$lookup: {from: 'categories', localField: '_id', foreignField: 'parent', as: 'subCategories'}}
        ])
      }
      result.forEach(i => {
        i.count = i.subCategories.length
      })
      res.send({
        code: 0,
        data: result
      })
  })
  /* 获取全部目录 */
  router.get('/categories', async (req, res) => {
    try {
      const result = await Category.find()
      res.send({
        code: 0,
        data: result
      })
    } catch (err) {
      console.log('获取全部目录错误', err)
      res.send({
        code: 1,
        msg: '服务器错误，请刷新后重试'
      })
    }
  })
  /* 增加目录 */
  router.post('/categories', (req, res) => {
    const categoryEntity = new Category({
      ...req.body
    })
    categoryEntity.save((err, result) => {
      if (err) {
        console.log('添加目录错误', err)
        res.send({
          code: 1,
          msg: '服务器错误，请刷新后重试'
        })
        return
      }
      res.send({
        code: 0,
        data: {
          msg: '添加成功！'
        }
      })
    })
  })
  /* 更新目录 */
  router.put('/categories', (req, res) => {
    const { _id, name, desc } = req.body
    Category.findByIdAndUpdate(_id, {$set:{name: name, desc: desc}}, (err, data) => {
      if (err) {
        console.log('更新错误', err)
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
}