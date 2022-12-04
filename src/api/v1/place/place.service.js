const db = require('../../database')
const PAGESIZE = db.PAGESIZE
const Place = db.place
const Review = db.review
const { getRate } = require('../helpers/utils')

module.exports = {
    findWithPagination: async (condition, page = 1, pageSize = 2, sort) => {
        if (!PAGESIZE.includes(pageSize)) {
            pageSize = 10
        }
        let data = []
        let rates = []
        const totalItems = await Place.find(condition).count()
        if (pageSize === -1) {
            data = await Place.find(condition)
                .populate('author', ['username'])
                .sort(sort)
                .lean()
        } else {
            data = await Place.find(condition)
                .populate('author', ['username'])
                .sort(sort)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean()
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
