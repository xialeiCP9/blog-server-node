// 权限
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const permissionSchema = new Schema({
  name: String,
  desc: String
})

const Permission = mongoose.model('permission', permissionSchema)
module.exports = Permission
