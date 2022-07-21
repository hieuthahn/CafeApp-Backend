const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const db = {}
db.mongoose = mongoose
db.user = require('../v1/user/user.models')
db.role = require('../v1/role/role.models')
db.ROLES = ['user', 'admin', 'moderator']
module.exports = db
