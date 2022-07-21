const config = require('../../config/auth.config')
const db = require('../../database')
const User = db.user
const Role = db.role
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

exports.signup = (req, res, next) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    })
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: err })
            return
        }
        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles },
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ success: false, message: err })
                        return
                    }
                    user.roles = roles.map((role) => role._id)
                    user.save((err) => {
                        if (err) {
                            res.status(500).send({
                                success: false,
                                message: err,
                            })
                            return
                        }
                        res.send({
                            success: true,
                            message: 'User was registered successfully!',
                        })
                    })
                },
            )
        } else {
            Role.findOne({ name: 'user' }, (err, role) => {
                if (err) {
                    res.send(500).message({ success: false, message: err })
                    return
                }
                user.roles = [role._id]
                user.save((err) => {
                    if (err) {
                        res.status(500).send({ success: false, message: err })
                        return
                    }
                    res.send({
                        success: true,
                        message: 'User was registered successfully!',
                    })
                })
            })
        }
    })
}
exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    })
        .populate('roles', '-__v')
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ success: false, message: err })
                return
            }
            if (!user) {
                return res
                    .status(404)
                    .send({ success: false, message: 'User not found.' })
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password,
            )
            if (!passwordIsValid) {
                return res.status(401).message({
                    success: false,
                    message: 'Invalid Password',
                    accessToken: null,
                })
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, // 24 hours
            })
            var authorities = []
            user.roles.forEach((role) => {
                authorities.push('ROLE_' + role.name.toUpperCase())
            })
            res.status(200).send({
                success: true,
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
            })
        })
}
