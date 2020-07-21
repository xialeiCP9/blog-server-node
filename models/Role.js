/* 角色 */
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const roleSchema = new Schema({
  name: String,
  permissions: [mongoose.Types.ObjectId],
  isDefault: Boolean
})

const Role = mongoose.model('role', roleSchema)
module.exports = Role
