const db = require('../../database')
const Place = db.place
const { toSlug } = require('../helpers/utils')

checkDuplicatePlaceNameOrSlug = (req, res, next) => {
    const data = JSON.parse(req.body.data)
    Place.findOne({ slug: toSlug(data.name) }).exec((err, place) => {
        if (err) {
            return res.status(500).send({ success: false, message: err })
        }
        if (place) {
            return res.status(400).send({
                success: false,
                message: 'Tên quán cafe đã tồn tại',
            })
        }

        Place.findOne({ name: data.name }).exec((err, place) => {
            if (err) {
                return res.status(500).send({ success: false, message: err })
            }
            if (place) {
                return res.status(400).send({
                    success: false,
                    message: 'Tên quán cafe đã tồn tại',
                })
            }
            return
        })
        next()
    })
}

const verifyPlace = { checkDuplicatePlaceNameOrSlug }
module.exports = verifyPlace
