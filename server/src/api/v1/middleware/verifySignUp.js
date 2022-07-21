const db = require('../../database')
const ROLES = db.ROLES
const User = db.user
checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: err })
            return
        }
        if (user) {
            res.status(400).send({
                success: false,
                message: 'Failed! Username is alreade in use!',
            })
            return
        }
        // Email
        User.findOne({ email: req.body.email }).exec((err, user) => {
            if (err) {
                res.status(500).send({ success: false, message: err })
            }
            if (user) {
                res.status(400).send({
                    success: false,
                    message: 'Failed! Email is already in use!',
                })
                return
            }
            next()
        })
    })
}
checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        req.body.roles.length.forEach((role) => {
            if (!ROLES.includes(role)) {
                res.status(400).send({
                    success: false,
                    message: `Failed! Roles ${role} does not exist!`,
                })
            }
            return
        })
    }
    next()
}
const verifySignUp = { checkDuplicateUsernameOrEmail, checkRolesExisted }
module.exports = verifySignUp
