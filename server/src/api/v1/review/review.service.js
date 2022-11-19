const db = require('../../database')
const PAGESIZE = db.PAGESIZE
const Review = db.review

module.exports = {
    findWithPagination: async (condition, page = 1, pageSize = 2, sort) => {
        if (!PAGESIZE.includes(pageSize)) {
            pageSize = 10
        }
        let data = []
        const totalItems = await Review.find(condition).count()
        if (pageSize === -1) {
            data = await Review.find(condition).populate('author').sort(sort)
        } else {
            data = await Review.find(condition)
                .populate('author', ['-password', '-email'])
                .populate('place')
                .sort(sort)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
        }

        const totalPages = Math.ceil(+totalItems / pageSize)

        return {
            data,
            totalPages,
            currentPage: page,
            pageSize: pageSize,
            totalItems,
            totalPages,
        }
    },
    findByIdWithPagination: async (id, page = 1, pageSize = 2, sort) => {
        if (!PAGESIZE.includes(pageSize)) {
            pageSize = 10
        }
        let data = []
        const totalItems = await Review.findById(id).count()
        if (pageSize === -1) {
            data = await Review.findById(id).populate('author').sort(sort)
        } else {
            data = await Review.findById(id)
                .populate('author', ['-password', '-email'])
                .sort(sort)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
        }

        const totalPages = Math.ceil(+totalItems / pageSize)

        return {
            data,
            totalPages,
            currentPage: page,
            pageSize: pageSize,
            totalItems,
        }
    },
}
