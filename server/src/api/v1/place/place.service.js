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

            data?.forEach(async (place, index) => {
                const reviews = await Review.find({ place: place?._id })
                const rate = {
                    avg: getRate(reviews, 'avg'),
                    position: getRate(reviews, 'position'),
                    drink: getRate(reviews, 'drink'),
                    view: getRate(reviews, 'view'),
                    price: getRate(reviews, 'price'),
                    service: getRate(reviews, 'service'),
                    rateCount: reviews.length,
                }
                rates = rate
                // console.log(rates)
            })
        }

        // data?.forEach((item, index) => (item.rate = rates[index]))
        // console.log(rates)
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
