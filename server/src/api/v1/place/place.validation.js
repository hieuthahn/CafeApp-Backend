const validator = require('validator')

module.exports = {
    checkRequired: (req, res, next) => {
        const { isEmpty } = validator
        const data = req.body.data ? JSON.parse(req.body.data) : {}
        if (!data.name) {
            return res.status(400).send({
                success: false,
                message: 'Place name can not be empty!',
            })
        }

        if (!data.address) {
            return res.status(400).send({
                success: false,
                message: 'Place address can not be empty!',
            })
        }

        if (!data.region) {
            return res.status(400).send({
                success: false,
                message: 'Place region can not be empty!',
            })
        }

        if (!data.address.specific) {
            return res.status(400).send({
                success: false,
                message: 'Place description can not be empty!',
            })
        }
        next()
    },
}
