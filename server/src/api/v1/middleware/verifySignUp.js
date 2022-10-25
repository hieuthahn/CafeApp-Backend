const db = require('../../database')
const ROLES = db.ROLES
const User = db.user
checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (err) {
            return res.status(500).send({ success: false, message: err })
        }
        if (user) {
            return res.status(400).send({
                success: false,
                message: 'Failed! Username is already in use!',
            })
        }
        // Email
        User.findOne({ email: req.body.email }).exec((err, user) => {
            if (err) {
                return res.status(500).send({ success: false, message: err })
            }
            if (user) {
                return res.status(400).send({
                    success: false,
                    message: 'Failed! Email is already in use!',
                })
            }
        })
        next()
    })
}
checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({
                    success: false,
                    message: `Failed! Roles ${req.body.roles[i]} does not exist!`,
                })
            }
        }
    }
    next()
}
const verifySignUp = { checkDuplicateUsernameOrEmail, checkRolesExisted }
module.exports = verifySignUp
