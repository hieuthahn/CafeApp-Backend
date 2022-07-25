const jwt = require('jsonwebtoken')
const config = require('../../config/auth.config')
const db = require('../../database')
const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
    let token = req.session.token
    if (!token) {
        return res
            .status(403)
            .send({ success: false, message: 'No token provided!' })
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
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
            return res.status(500).send({ message: err })
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        return next()
                    }
                }
                return res.status(403).send({ message: 'Require Admin Role!' })
            },
        )
    })
}
isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'moderator') {
                        return next()
                    }
                }
                return res
                    .status(403)
                    .send({ message: 'Require Moderator Role!' })
            },
        )
    })
}
const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
}
module.exports = authJwt
