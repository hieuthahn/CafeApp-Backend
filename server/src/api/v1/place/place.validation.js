const validator = require('validator')

module.exports = {
    checkRequired: (req, res, next) => {
        const { isEmpty } = validator

        if (!isEmpty(req.body.name)) {
            return res.status(400).send({
                success: false,
                message: 'Place name can not be empty!',
            })
        }

        if (!isEmpty(req.body.address)) {
            return res.status(400).send({
                success: false,
                message: 'Place address can not be empty!',
            })
        }

        if (!isEmpty(req.body.address.region)) {
            return res.status(400).send({
                success: false,
                message: 'Place region can not be empty!',
            })
        }

        if (!isEmpty(req.body.address.description)) {
            return res.status(400).send({
                success: false,
                message: 'Place description can not be empty!',
            })
        }
        next()
    },
}
