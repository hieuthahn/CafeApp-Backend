const controller = require('./review.controller')
const { authJwt } = require('../middleware')
const router = require('express').Router()
const uploadCloud = require('../../config/cloundinary.config')

module.exports = (app) => {
    // Create a new Review
    router.post(
        '/',
        [
            authJwt.verifyToken,
            uploadCloud.fields([{ name: 'photo', maxCount: 20 }]),
        ],
        controller.create,
    )
    // Retrieve all Reviews
    router.get('/', controller.findAll)
    // router.get('/', controller.findAllAndUpdate)

    // Retrieve a single Review with id
    router.get('/:placeId', controller.findByPlaceId)
    // Update a Review with id
    router.put(
        '/:id',
        [
            authJwt.verifyToken,
            // uploadCloud.fields([
            //     { name: 'image', maxCount: 20 },
            // ]),
        ],
        controller.update,
    )
    // Delete a Review with id
    router.delete('/:id', [authJwt.verifyToken], controller.delete)
    // Create a new Review
    router.delete(
        '/',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll,
    )

    app.use('/api/v1/review', router)
}
