const db = require('../../database')
const Place = db.place
const { toSlug } = require('../helpers/utils')
const { findWithPagination } = require('./place.service')
const PAGESIZE = db.PAGESIZE

exports.create = async (req, res) => {
    const place = new Place({
        name: req.body.name,
        slug: toSlug(req.body.name),
        thumbnail: req.body.thumbnail ? req.body.thumbnail : '',
        order: req.body.order ? req.body.order : '',
        isHot: req.body.isHot ? req.body.isHot : false,
        deleted: req.body.deleted ? req.body.deleted : false,
    })

    try {
        const data = await place.save(place)
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
    const { page = 1, pagesize } = req.query

    const condition = name
        ? { name: { $regex: new RegExp(name), $options: 'i' } }
        : {}
    try {
        const { data, totalPages, currentPage, pageSize } =
            await findWithPagination(condition, +page, +pagesize)

        if (data) {
            return res.status(200).send({
                success: true,
                data,
                meta: {
                    totalPages,
                    currentPage,
                    pageSize,
                },
            })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Place with name ' + name,
        })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id
    try {
        const data = await Place.findById(id)
        if (data) {
            return res.status(200).send({ success: true, data })
        }
        return res
            .status(404)
            .send({ success: false, message: 'Not found Place with id ' + id })
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
        const data = await Place.findByIdAndUpdate(id, body, {
            useFindAndModify: false,
        })
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Place was updated successfully.',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not update Place with id=${id}.`,
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
        const data = await Place.findByIdAndRemove(id)
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Place was deleted successfully!',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not delete Place with id=${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.deleteAll = async (req, res) => {
    try {
        const data = await Place.deleteMany({})
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'All Places was deleted successfully!',
            })
        }
        return res
            .status(400)
            .send({ success: false, message: 'Can not delete Places!' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.search = async (req, res) => {
    const { name, page, benefits, regions, tags, opening, price } = req.body
    const slugName = toSlug(name)

    const condition = name
        ? { name: { $regex: new RegExp(name), $options: 'i' } }
        : {}
    const filter = {
        slug: slugName ? { $regex: new RegExp(name), $options: 'i' } : null,
        page: page ? page : 1,
        benefits: slugName ? { $regex: new RegExp(name), $options: 'i' } : '',
        regions: slugName ? { $regex: new RegExp(name), $options: 'i' } : '',
        tags: slugName ? { $regex: new RegExp(name), $options: 'i' } : '',
        opening: opening ? opening : null,
        price: price ? price : null,
    }
    try {
        const data = await Place.find(filter)
        if (data) {
            return res.status(200).send({ success: true, data })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Place with name ' + name,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}
