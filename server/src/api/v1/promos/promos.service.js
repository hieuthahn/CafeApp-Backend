const db = require('../../database')
const PAGESIZE = db.PAGESIZE
const Promos = db.promos

module.exports = {
    findWithPagination: async (condition, page = 1, pageSize = 2, sort) => {
        if (!PAGESIZE.includes(pageSize)) {
            pageSize = 10
        }
        let data = []
        const totalItems = await Promos.find(condition).count()
        if (pageSize === -1) {
            data = await Promos.find(condition).populate('author').sort(sort)
        } else {
            data = await Promos.find(condition)
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
        const totalItems = await Promos.findById(id).count()
        if (pageSize === -1) {
            data = await Promos.findById(id).populate('author').sort(sort)
        } else {
            data = await Promos.findById(id)
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
