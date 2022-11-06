const controller = require('./place.controller')
const { authJwt } = require('../middleware')
const router = require('express').Router()
const validation = require('./place.validation')
const uploadCloud = require('../../config/cloundinary.config')

module.exports = (app) => {
    // Create a new Region
    router.post(
        '/',
        [
            authJwt.verifyToken,
            uploadCloud.fields([
                { name: 'photo', maxCount: 20 },
                { name: 'menu', maxCount: 20 },
            ]),
            validation.checkRequired,
        ],
        controller.create,
    )
    // Retrieve all Regions
    router.get('/', controller.findAll)
    // router.get('/', controller.findAllAndUpdate)
    // Search Place
    router.post('/search', controller.search)
    // Retrieve a single Region with id
    router.get('/:id', controller.findOne)
    // Update a Region with id
    router.put(
        '/:id',
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
            uploadCloud.fields([
                { name: 'photo', maxCount: 20 },
                { name: 'menu', maxCount: 20 },
            ]),
        ],
        controller.update,
    )
    // Delete a Region with id
    router.delete(
        '/:id',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.delete,
    )
    // Create a new Region
    router.delete(
        '/',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll,
    )

    app.use('/api/v1/place', router)
}
