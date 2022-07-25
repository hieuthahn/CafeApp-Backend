const db = require('../../database')
const Benefit = db.benefit
const { toSlug } = require('../helpers/utils')

exports.create = async (req, res) => {
    if (!req.body.name) {
        return res
            .status(400)
            .send({ success: false, message: 'Benefit name can not be empty!' })
    }

    const benefit = new Benefit({
        name: req.body.name,
        slug: toSlug(req.body.name),
        icon: req.body.icon ? req.body.icon : '',
        order: req.body.order ? req.body.order : '',
        isHot: req.body.isHot ? req.body.isHot : false,
        deleted: req.body.deleted ? req.body.deleted : false,
        color: req.body.color ? req.body.color : '',
    })

    try {
        const data = await benefit.save(benefit)
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
        const data = await Benefit.find(condition)
        if (data) {
            return res.status(200).send({ success: true, data })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Benefit with name ' + name,
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
        const data = await Benefit.findById(id)
        if (data) {
            return res.status(200).send({ success: true, data })
        }
        return res.status(404).send({
            success: false,
            message: 'Not found Benefit with id ' + id,
        })
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
        const data = await Benefit.findByIdAndUpdate(id, body, {
            useFindAndModify: false,
        })
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Benefit was updated successfully.',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not update Benefit with id=${id}.`,
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
        const data = await Benefit.findByIdAndRemove(id)
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Benefit was deleted successfully!',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not delete Benefit with id=${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.deleteAll = async (req, res) => {
    try {
        const data = await Benefit.deleteMany({})
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'All Benefits was deleted successfully!',
            })
        }
        return res
            .status(400)
            .send({ success: false, message: 'Can not delete Benefits!' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}
