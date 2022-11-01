const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const db = {}
db.mongoose = mongoose
db.user = require('../v1/user/user.model')
db.role = require('../v1/role/role.model')
db.auth = require('../v1/auth/auth.model')
db.region = require('../v1/region/region.model')
db.benefit = require('../v1/benefit/benefit.model')
db.tag = require('../v1/tag/tag.model')
db.purpose = require('../v1/purpose/purpose.model')
db.place = require('../v1/place/place.model')
db.ROLES = ['user', 'admin', 'moderator']
db.PAGESIZE = [-1, 1, 2, 3, 8, 10, 20, 30]
module.exports = db
