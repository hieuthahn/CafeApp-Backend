const db = require('../../database')
const PAGESIZE = db.PAGESIZE
const User = db.user

module.exports = {
    findWithPagination: async (condition, page = 1, pageSize = 2, sort) => {
        if (!PAGESIZE.includes(pageSize)) {
            pageSize = 10
        }
        let data = []
        const totalItems = await User.find(condition).count()
        if (pageSize === -1) {
            data = await User.find(condition)
                .select(['-password'])
                .populate('roles')
                .sort(sort)
        } else {
            data = await User.find(condition)
                .select(['-password'])
                .populate('roles')
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
}
