const db = require('../../database')
const Region = db.region
const { toSlug } = require('../helpers/utils')

exports.create = async (req, res) => {
    // if (!req.body.name) {
    //     return res
    //         .status(400)
    //         .send({ success: false, message: 'Region name can not be empty!' })
    // }

    const region = new Region({
        name: req.body.name,
        slug: toSlug(req.body.name),
        thumbnail: req.body.thumbnail ? req.body.thumbnail : '',
        order: req.body.order ? req.body.order : '',
        isHot: req.body.isHot ? req.body.isHot : false,
        deleted: req.body.deleted ? req.body.deleted : false,
    })

    try {
        const data = await region.save(region)
        if (data) {
            return res.status(200).send({ success: true, data })
        }

        return res
            .status(403)
            .send({ success: false, message: 'Can not save to database!' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.findAll = async (req, res) => {
    const name = req.query.name
    const condition = name
        ? { name: { $regex: new RegExp(name), $options: 'i' } }
        : {}
    try {
        const data = await Region.find(condition)
        if (data) {
            return res.status(200).send({ success: true, data })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Region with name ' + name,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id
    try {
        const data = await Region.findById(id)
        if (data) {
            return res.status(200).send({ success: true, data })
        }
        return res
            .status(404)
            .send({ success: false, message: 'Not found Region with id ' + id })
    } catch (error) {
        return res.status(500).send({ success: false, message: error })
    }
}

exports.update = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({
            success: false,
            message: 'Data to update can not be empty name!',
        })
    }
    const id = req.params.id
    const body = {
        ...req.body,
        slug: toSlug(req.body.name),
    }
    try {
        const data = await Region.findByIdAndUpdate(id, body, {
            useFindAndModify: false,
        })
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Region was updated successfully.',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not update Region with id=${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.delete = async (req, res) => {
    const id = req.params.id
    try {
        const data = await Region.findByIdAndRemove(id)
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Region was deleted successfully!',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not delete Region with id=${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.deleteAll = async (req, res) => {
    try {
        const data = await Region.deleteMany({})
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'All Regions was deleted successfully!',
            })
        }
        return res
            .status(400)
            .send({ success: false, message: 'Can not delete Regions!' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}
