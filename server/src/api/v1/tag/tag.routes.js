const controller = require('./tag.controller')
const { authJwt } = require('../middleware')
const router = require('express').Router()

module.exports = (app) => {
    // Create a new Region
    router.post('/', [authJwt.verifyToken], controller.create)
    // Retrieve all Regions
    router.get('/', [authJwt.verifyToken], controller.findAll)
    // Retrieve a single Region with id
    router.get('/:id', controller.findOne)
    // Update a Region with id
    router.put('/:id', controller.update)
    // Delete a Region with id
    router.delete('/:id', controller.delete)
    // Create a new Region
    router.delete('/', controller.deleteAll)

    app.use('/api/v1/tag', router)
}
