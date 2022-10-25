const db = require('../../database')
const Tag = db.tag
const { toSlug } = require('../helpers/utils')

exports.create = async (req, res) => {
    if (!req.body.name) {
        return res
            .status(400)
            .send({ success: false, message: 'Tag name can not be empty!' })
    }

    const tag = new Tag({
        name: req.body.name,
        slug: toSlug(req.body.name),
        order: req.body.order ? req.body.order : '',
        isHot: req.body.isHot ? req.body.isHot : false,
        deleted: req.body.deleted ? req.body.deleted : false,
        color: req.body.color ? req.body.color : '',
    })

    try {
        const data = await tag.save(tag)
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
        const data = await Tag.find(condition)
        if (data) {
            return res.status(200).send({ success: true, data })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Tag with name ' + name,
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
        const data = await Tag.findById(id)
        if (data) {
            return res.status(200).send({ success: true, data })
        }
        return res.status(404).send({
            success: false,
            message: 'Not found Tag with id ' + id,
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
        updatedAt: Date.now(),
    }
    try {
        const data = await Tag.findByIdAndUpdate(id, body, {
            useFindAndModify: false,
        })
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Tag was updated successfully.',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not update Tag with id=${id}.`,
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
        const data = await Tag.findByIdAndRemove(id)
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Tag was deleted successfully!',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not delete Tag with id=${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.deleteAll = async (req, res) => {
    try {
        const data = await Tag.deleteMany({})
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'All Tags was deleted successfully!',
            })
        }
        return res
            .status(400)
            .send({ success: false, message: 'Can not delete Tags!' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}
