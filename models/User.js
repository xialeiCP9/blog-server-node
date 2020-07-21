const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  'username': {
    type: String,
    unique: true
  },
  'password': {
    type: String,
    select: false,
    set(val){
      return require('bcrypt').hashSync(val, 10)
    }
  },
  'avatar': {
    type: String,
    default: 'http://localhost:3000/avatar.jpg'
  },
  'email' : String,
  'introduction': String,
  'role': mongoose.Types.ObjectId,
  'isValid': {
    type: Boolean,
    default: true
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
