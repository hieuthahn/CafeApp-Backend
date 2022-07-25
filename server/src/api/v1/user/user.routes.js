const { authJwt } = require('../middleware')
const controller = require('./user.controller')

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        )
        next()
    })
    app.get('/api/v1/user/all', controller.allAccess)
    app.get('/api/v1/user', [authJwt.verifyToken], controller.userBoard)
    app.get(
        '/api/v1/user/mod',
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard,
    )
    app.get(
        '/api/v1/user/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard,
    )
}
