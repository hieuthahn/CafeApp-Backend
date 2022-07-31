const validator = require('validator')

module.exports = {
    checkRequired: (req, res, next) => {
        const { isEmpty } = validator

        if (!req.body.name) {
            return res.status(400).send({
                success: false,
                message: 'Place name can not be empty!',
            })
        }

        if (!req.body.address) {
            return res.status(400).send({
                success: false,
                message: 'Place address can not be empty!',
            })
        }

        if (!req.body.region) {
            return res.status(400).send({
                success: false,
                message: 'Place region can not be empty!',
            })
        }

        if (!req.body.address.desc) {
            return res.status(400).send({
                success: false,
                message: 'Place description can not be empty!',
            })
        }
        next()
    },
}
