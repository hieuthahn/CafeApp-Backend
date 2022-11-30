const { authJwt } = require('../middleware')
const controller = require('./user.controller')
const router = require('express').Router()
const uploadCloud = require('../../config/cloundinary.config')

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        )
        next()
    })

    router.get(
        '/all',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.findAllByAdmin,
    )
    router.get('/', [authJwt.verifyToken], controller.findOne)
    router.get(
        '/mod',
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard,
    )
    router.get(
        '/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard,
    )

    router.put('/', [authJwt.verifyToken], controller.update)
    router.put(
        '/avatar',
        [
            authJwt.verifyToken,
            uploadCloud.fields([{ name: 'avatar', maxCount: 1 }]),
        ],
        controller.updateAvatar,
    )

    app.use('/api/v1/profile', router)
}
