const db = require('../../database')
const PAGESIZE = db.PAGESIZE
const Review = db.review

module.exports = {
    findWithPagination: async (condition, page = 1, pagesize = 2, sort) => {
        if (!PAGESIZE.includes(pagesize)) {
            pagesize = 10
        }
        let data = []
        const totalItems = await Review.find(condition).count()
        if (pagesize === -1) {
            data = await Review.find(condition).populate('author').sort(sort)
        } else {
            data = await Review.find(condition)
                .populate('author', ['-password', '-email'])
                .sort(sort)
                .skip((page - 1) * pagesize)
                .limit(pagesize)
        }

        const totalPages = Math.ceil(+totalItems / pagesize)

        return {
            data,
            totalPages,
            currentPage: page,
            pageSize: pagesize,
            totalItems,
        }
    },
}
