const mongoose = require('mongoose')

const Schema = mongoose.Schema

const articleSchema = new Schema({
  title: String,
  category: mongoose.Types.ObjectId,
  desc: String,
  content: String,
  likes: {
    type: [{
      _id: mongoose.Types.ObjectId,
      username: String
    }],
    default: []
  },
  comments: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  author: mongoose.Types.ObjectId,
  bgImg: String,
  createAt: {
    type: Number,
    default: new Date().getTime()
  },
  updateAt: {
    type: Number,
    default: new Date().getTime()
  },
  isPublish: {
    type: Boolean,
    default: false
  }
})

const Article = mongoose.model('article', articleSchema)

module.exports = Article
