const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: String,
  publishAt: {
    type: Number,
    default: new Date().getTime()
  },
  creator: mongoose.Types.ObjectId,
  article: mongoose.Types.ObjectId,
  parentCommentId: mongoose.Types.ObjectId
})

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment