const db = require('../../database')
const PAGESIZE = db.PAGESIZE
const Place = db.place

module.exports = {
    findWithPagination: async (condition, page = 1, pagesize = 2) => {
        if (!PAGESIZE.includes(pagesize)) {
            pagesize = 10
        }
        const totalItems = await Place.find(condition).count()
        const data = await Place.find(condition)
            .skip((page - 1) * pagesize)
            .limit(pagesize)

        const totalPages = Math.ceil(+totalItems / pagesize)

        return {
            data,
            totalPages,
            currentPage: page,
            pageSize: pagesize,
        }
    },
}
