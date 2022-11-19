const controller = require('./like.controller')
const { authJwt } = require('../middleware')
const router = require('express').Router()

module.exports = (app) => {
    // Create a new Review
    router.post('/:placeId', [authJwt.verifyToken], controller.create)
    // Retrieve all Reviews
    router.get('/', [authJwt.getDataFromToken], controller.findByUserId)
    // router.get('/', controller.findAllAndUpdate)

    // Retrieve a single Review with id
    router.get(
        '/:placeId',
        [authJwt.getDataFromToken],
        controller.findByPlaceId,
    )

    router.get('/profile', [authJwt.getDataFromToken], controller.findByUserId)

    app.use('/api/v1/like', router)
}
