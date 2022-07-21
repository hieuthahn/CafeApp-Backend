const jwt = require('jsonwebtoken')
const config = require('../../config/auth.config')
const db = require('../../database')
const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']
    if (!token) {
        return res
            .status(403)
            .send({ success: false, message: 'No token provided!' })
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return status(401).send({
                success: false,
                message: 'Unauthorized!',
            })
        }
        req.userId = decoded.id
        next()
    })
}
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: err })
            return
        }
    })
    Role.find({
        _id: { $in: user.roles },
    }),
        (err, roles) => {
            if (err) {
                res.status(500).send({ success: false, message: err })
                return
            }
            roles.forEach((role) => {
                if (role.name === 'admin') next()
                return
            })
            res.status(403).send({
                success: false,
                message: 'Required Admin Role!',
            })
        }
}
isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: err })
            return
        }
    })
    Role.find({
        _id: { $in: user.roles },
    }),
        (err, roles) => {
            if (err) {
                res.status(500).send({ success: false, message: err })
                return
            }
            roles.forEach((role) => {
                if (role.name === 'moderator') next()
                return
            })
            res.status(403).send({
                success: false,
                message: 'Required Moderator Role!',
            })
        }
}
const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
}
module.exports = authJwt
