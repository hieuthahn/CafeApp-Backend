const db = require('../../database')
const Review = db.review
const { toSlug, getLatLong } = require('../helpers/utils')
const {
    findWithPagination,
    findByIdWithPagination,
} = require('./review.service')
const PAGESIZE = db.PAGESIZE
const cloudinary = require('cloudinary').v2
const { getRateAvg } = require('../helpers/utils')
var moment = require('moment')
moment.locale('vi')

exports.create = async (req, res) => {
    const data = req.body?.data ? JSON.parse(req.body.data) : {}
    if (!data) {
        return res.status(403).send({
            success: false,
            message: 'Data can not be empty',
        })
    }

    const photos = req?.files?.photo
        ? req.files.photo.map((image) => ({
              url: image?.path,
              filename: image?.filename,
              originalName: image?.originalname,
              size: image?.size,
          }))
        : []

    if (data?.rate) {
        const avg = getRateAvg(data.rate)
        data.rate.avg = avg
    }

    const review = new Review({
        ...data,
        author: req?.userId,
        photos,
    })

    try {
        const data = await Review.create(review)
        if (data) {
            return res.status(200).send({ success: true, data })
        }

        return res.status(403).send({
            success: false,
            message: 'Can not save to database!' + data,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error' + error,
        })
    }
}

exports.findAll = async (req, res) => {
    const name = req.query.name
    const userId = req.userId
    const { page = 1, pageSize } = req.query
    const condition = userId ? { author: userId } : {}
    try {
        const result = await findWithPagination(condition, +page, +pageSize)

        if (result.data) {
            return res.status(200).send({
                success: true,
                data: result.data,
                meta: {
                    totalPages: res.totalPages,
                    currentPage: result.currentPage,
                    pageSize: result.pageSize,
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                },
            })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Review with name ' + name,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error',
        })
    }
}

exports.findByPlaceId = async (req, res) => {
    const placeId = req.params?.placeId
    const { page = 1, pageSize = 6 } = req.query

    try {
        if (placeId.match(/^[0-9a-fA-F]{24}$/)) {
            const condition = {
                place: placeId,
            }
            const result = await findWithPagination(condition, +page, +pageSize)

            if (result.data) {
                return res.status(200).send({
                    success: true,
                    data: result.data,
                    meta: {
                        totalPages: result.totalPages,
                        currentPage: result.currentPage,
                        pageSize: result.pageSize,
                        totalItems: result.totalItems,
                    },
                })
            }
        } else {
            return res
                .status(400)
                .send({ success: false, message: 'Id bài viết không hợp lệ' })
        }

        return res
            .status(200)
            .send({ success: false, message: 'Not found Review with ' + id })
    } catch (error) {
        return res.status(500).send({ success: false, message: error })
    }
}

exports.update = async (req, res) => {
    const data = req.body?.data ? JSON.parse(req.body.data) : {}
    const photos =
        req?.files?.photo &&
        req.files.photo.map((image) => ({
            url: image?.path,
            filename: image?.filename,
            originalName: image?.originalname,
            size: image?.size,
        }))

    const id = req.params.id
    const body = {
        ...data,
    }
    if (data?.rate) {
        const avg = getRateAvg(data.rate)
        data.rate.avg = avg
    }

    if (photos) {
        body.photos = photos
    }

    try {
        const data = await Review.findByIdAndUpdate(id, body, {
            useFindAndModify: false,
        })
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Review was updated successfully.',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Can not update Review with id=${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.delete = async (req, res) => {
    const id = req.params.id
    const userId = req.userId
    const files = req.query?.files || []
    try {
        const review = await Review.findById(id)
        if (review.author.toString() !== userId) {
            return res.status(200).send({
                success: false,
                message: 'Bạn không phải tác giả của đánh giá này',
            })
        }
        const data = await Review.findByIdAndRemove(id, { author: userId })
        if (files.length) {
            cloudinary.api.delete_resources(files, (err, result) =>
                console.log(err, result),
            )
        }

        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Xóa đánh giá thành công',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Xóa đánh giá thất bại ${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' + error })
    }
}

exports.deleteAll = async (req, res) => {
    try {
        const data = await Review.deleteMany({})
        cloudinary.api.delete_all_resources()
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'All Reviews was deleted successfully!',
            })
        }
        return res
            .status(400)
            .send({ success: false, message: 'Can not delete Reviews!' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.search = async (req, res) => {
    const {
        name,
        page = 1,
        pageSize = 10,
        benefits,
        regions,
        tags,
        opening,
        price,
        sort,
    } = req.body
    const slugName = name ? toSlug(name) : ''
    const filter = {
        // name: name ? { $regex: name, $options: 'i' } : undefined,
        // benefits: slugName ? { $regex: new RegExp(name), $options: 'i' } : '',
        // regions: slugName ? { $regex: new RegExp(name), $options: 'i' } : '',
        // tags: slugName ? { $regex: new RegExp(name), $options: 'i' } : '',
        // opening: opening ? opening : '',
        // price: price ? price : '',
    }

    if (name) {
        filter.name = { $regex: name, $options: 'i' }
    }

    try {
        const result = await findWithPagination(condition, +page, +pageSize)

        if (result.data) {
            return res.status(200).send({
                success: true,
                data: result.data,
                meta: {
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    pageSize: result.pageSize,
                },
            })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Review with name ' + name,
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
        const Reviews = await Review.find()
        let count = 0
        if (Reviews) {
            Reviews.forEach(async (item) => {
                try {
                    const data = await Review.updateOne(
                        { _id: item._id },
                        { slug: toSlug(item.name) },
                    )
                    if (data) {
                        count++
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
