const db = require('../../database')
const Place = db.place
const Region = db.region
const Purpose = db.purpose
const Tag = db.tag
const Benefit = db.benefit
const { toSlug, getLatLong } = require('../helpers/utils')
const { findWithPagination } = require('./place.service')
const PAGESIZE = db.PAGESIZE
const cloudinary = require('cloudinary').v2

exports.create = async (req, res) => {
    // const { desc, specific } = req.body.address
    // const { lat, lng } = await getLatLong(desc)
    const data = JSON.parse(req.body.data)
    console.log(req.userId)
    const photos = req.files.photo
        ? req.files.photo.map((image) => ({
              url: image?.path,
              filename: image?.filename,
              originalName: image?.originalname,
              size: image?.size,
          }))
        : []
    const menu = req.files.menu
        ? req.files.menu.map((image) => ({
              url: image?.path,
              filename: image?.filename,
              originalName: image?.originalname,
              size: image?.size,
          }))
        : []

    const place = new Place({
        ...data,
        author: req?.userId,
        photos,
        menu,
    })
    // if (req.body.photo)
    // const place = new Place(req.body)

    try {
        const data = await Place.create(place)
        if (data) {
            return res.status(200).send({ success: true, data })
        }

        return res
            .status(403)
            .send({ success: false, message: 'Can not save to database!' })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error',
        })
    }
}

exports.findAll = async (req, res) => {
    const name = req.query.name
    const { page = 1, pageSize } = req.query
    const condition = name
        ? { name: { $regex: new RegExp(name), $options: 'i' } }
        : {}
    try {
        const { data, totalPages, currentPage, pageSize } =
            await findWithPagination(condition, +page, +pageSize)

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
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error',
        })
    }
}

exports.findOne = async (req, res) => {
    const id = req.params?.id

    try {
        let data = []
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            data = await Place.findById(id)
        } else {
            data = await Place.find({ slug: id })
        }

        if (data?._id) {
            return res.status(200).send({ success: true, data })
        }

        if (data.length) {
            return res.status(200).send({ success: true, data: data[0] })
        }

        return res
            .status(200)
            .send({ success: false, message: 'Not found Place with ' + id })
    } catch (error) {
        return res.status(500).send({ success: false, message: error })
    }
}

exports.update = async (req, res) => {
    const data = JSON.parse(req.body?.data || null)
    const photos =
        req?.files?.photo &&
        req.files.photo.map((image) => ({
            url: image?.path,
            filename: image?.filename,
            originalName: image?.originalname,
            size: image?.size,
        }))
    const menu =
        req?.files?.menu &&
        req.files.menu.map((image) => ({
            url: image?.path,
            filename: image?.filename,
            originalName: image?.originalname,
            size: image?.size,
        }))

    if (!data.name) {
        return res.status(400).send({
            success: false,
            message: 'Data to update can not be empty name!',
        })
    }
    const id = req.params.id
    const body = {
        ...data,
    }
    if (photos) {
        body.photos = photos
    }
    if (menu) {
        body.menu = menu
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
    const files = req.query.files
    try {
        const data = await Place.findByIdAndRemove(id)
        cloudinary.api.delete_resources(files, (err, result) =>
            console.log(err, result),
        )

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
        cloudinary.api.delete_all_resources()
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
    const {
        name,
        status,
        page = 1,
        pageSize = 10,
        benefits,
        purposes,
        regions,
        tags,
        opening,
        price,
        sort,
    } = req.body

    let filter = {}

    if (name) {
        filter.name = { $regex: name, $options: 'i' }
    }
    if (status?.length) {
        filter.status = { $in: status }
    }
    if (benefits?.length) {
        filter.benefits = { $in: benefits }
    }
    if (tags?.length) {
        filter.tags = { $in: tags }
    }
    if (purposes?.length) {
        filter.purposes = { $in: purposes }
    }
    if (regions?.length) {
        filter.region = { $in: regions }
    }

    if (price?.min?.toString() && price?.max?.toString()) {
        filter = {
            ...filter,
            'price.min': {
                $lte: +price?.max,
                $gte: +price?.min,
            },
            'price.max': {
                $gte: +price?.min,
                $lte: +price?.max,
            },
        }
    }

    try {
        const { data, totalPages, currentPage, pageSize, totalItems } =
            await findWithPagination(filter, +page, +pageSize, sort)

        if (data) {
            return res.status(200).send({
                success: true,
                data,
                meta: {
                    totalPages,
                    currentPage,
                    pageSize,
                    totalItems,
                },
            })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Place with name ' + name,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error ' + error,
        })
    }
}

exports.findAllAndUpdate = async (req, res) => {
    const name = req.query.name
    const { page = 1, pageSize } = req.query

    const condition = name
        ? { name: { $regex: new RegExp(name), $options: 'i' } }
        : {}
    try {
        const places = await Place.find()
        const purposes = await Purpose.find()

        const n = [3, 4]
        let count = 0
        if (places) {
            places.forEach(async (item) => {
                try {
                    if (item?.address?.specific) {
                        const random = Math.floor(Math.random() * n.length)
                        const shuffledName = purposes.map((item) => item.name)
                        const shuffled = shuffledName.sort(
                            () => 0.5 - Math.random(),
                        )
                        const data = await Place.updateOne(
                            { _id: item._id },
                            {
                                purposes: shuffled.slice(0, n[random]),
                            },
                        )
                        count += 1
                    }
                } catch (error) {
                    throw new Error(error)
                }
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Update success ' + count,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error',
        })
    }
}
