const controller = require('./place.controller')
const { authJwt } = require('../middleware')
const router = require('express').Router()
const validation = require('./place.validation')

module.exports = (app) => {
    // Create a new Region
    router.post('/', [validation.checkRequired], controller.create)
    // Retrieve all Regions
    router.get('/', controller.findAll)
    // Retrieve a single Region with id
    router.get('/:id', controller.findOne)
    // Update a Region with id
    router.put('/:id', controller.update)
    // Delete a Region with id
    router.delete('/:id', controller.delete)
    // Create a new Region
    router.delete('/', controller.deleteAll)
    // Search Place
    router.post('/search', controller.search)

    app.use('/api/v1/place', router)
}
