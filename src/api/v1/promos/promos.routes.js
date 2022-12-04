const controller = require('./promos.controller')
const { authJwt } = require('../middleware')
const router = require('express').Router()
const uploadCloud = require('../../config/cloundinary.config')

module.exports = (app) => {
    // Create a new Review
    router.post(
        '/',
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
            uploadCloud.fields([{ name: 'photo', maxCount: 3 }]),
        ],
        controller.create,
    )
    // Retrieve all Reviews
    router.get('/', [authJwt.getDataFromToken], controller.findAll)
    // router.get('/', controller.findAllAndUpdate)

    // Retrieve a single Review with id
    router.get('/:placeId', controller.findByPlaceId)
    // Update a Review with id
    router.put(
        '/:id',
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
            uploadCloud.fields([{ name: 'photo', maxCount: 3 }]),
        ],
        controller.update,
    )
    // Delete a Review with id
    router.delete(
        '/:id',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.delete,
    )
    // Create a new Review
    router.delete(
        '/',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll,
    )

    app.use('/api/v1/promos', router)
}
