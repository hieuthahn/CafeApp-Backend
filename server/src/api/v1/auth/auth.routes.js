const { verifySignUp } = require('../middleware')
const controller = require('./auth.controller')
module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        )
        next()
    })
    app.post(
        '/api/v1/auth/signup',
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted,
        ],
        controller.signup,
    )
    app.post('/api/v1/auth/signin', controller.signin)
}
