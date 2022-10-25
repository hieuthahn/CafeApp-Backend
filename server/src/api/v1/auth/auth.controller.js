const config = require('../../config/auth.config')
const db = require('../../database')
const User = db.user
const Role = db.role
const Auth = db.auth
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
const mongoose = require('mongoose')

exports.signup = (req, res, next) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        avatar: '',
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
                    return res
                        .send(500)
                        .message({ success: false, message: err })
                }
                user.roles = [role._id]
                user.save((err) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: false, message: err })
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
        .exec(async (err, user) => {
            if (err) {
                res.status(500).send({ success: false, message: err })
                return
            }
            if (!req.body.password) {
                return res.status(400).send({
                    success: false,
                    message: 'Missing username or password.',
                })
            }
            if (!user) {
                return res
                    .status(404)
                    .send({ success: false, message: 'User not found.' })
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password,
            )
            if (!passwordIsValid) {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid Password',
                    accessToken: null,
                })
            }
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration, // 24 hours
            })
            const refreshToken = jwt.sign(
                { id: user.id },
                config.secret_refresh,
                {
                    expiresIn: config.jwtRefreshExpiration,
                },
            )
            let auth = await Auth.saveRefreshToken(user, refreshToken)
            const authorities = []
            user.roles.forEach((role) => {
                authorities.push('ROLE_' + role.name.toUpperCase())
            })

            req.session.token = token
            req.session.refreshToken = refreshToken

            res.status(200).send({
                success: true,
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                avatar: user.avatar,
                accessToken: token,
                refreshToken: refreshToken,
                auth: auth,
            })
        })
}
exports.signout = async (req, res) => {
    try {
        req.session = null
        return res
            .status(200)
            .send({ success: true, message: "You've been signed out!" })
    } catch (error) {
        this.next(err)
    }
}
exports.refreshToken = async (req, res) => {
    let requestToken = req.session.refreshToken
    if (requestToken == null) {
        return res
            .status(403)
            .send({ success: false, message: 'Refresh token is required!' })
    }
    try {
        let auth = await Auth.findOne({
            'refreshToken.token': requestToken,
        })

        if (!auth) {
            return res.status(403).send({
                success: false,
                message: 'Refresh token is not exist!',
            })
        }

        jwt.verify(
            requestToken,
            config.secret_refresh,
            async (err, decoded) => {
                if (err) {
                    const result = await Auth.findByIdAndRemove({
                        _id: new mongoose.Types.ObjectId(auth._id),
                    })
                    if (result) {
                        return res.status(401).send({
                            success: false,
                            message:
                                'Refresh token was expired! Please make a new signin request!',
                        })
                    }

                    return res.status(500).send({
                        success: false,
                        message: 'Delete reresh token failed!',
                    })
                }
                const userId = decoded.id
                let newAccessToken = jwt.sign({ id: userId }, config.secret, {
                    expiresIn: config.jwtExpiration,
                })
                req.session.token = newAccessToken
                return res.status(200).send({
                    success: true,
                    accessToken: newAccessToken,
                    refreshToken: auth.refreshToken.token,
                })
            },
        )
    } catch (err) {
        console.log(err)
        return res.status(500).send({ success: false, message: err })
    }
}
