const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: String,
        address: {
            geo: {
                lat: String,
                lng: String,
            },
            region: { type: String, required: true },
            description: { type: String, required: true },
            direction: String,
        },
        intro: String,
        wifi: { name: String, password: String },
        avgRate: Number,
        imageCount: Number,
        openingStatus: String,
        openingTime: {
            open: String,
            close: String,
        },
        openingType: String,
        pice: {
            min: Number,
            max: Number,
        },
        reviewCount: Number,
        location: {
            coordinates: {
                lat: String,
                long: String,
            },
            type: String,
        },
        phone: String,
        photos: [],
        benefits: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Benefit',
            },
        ],
        regions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' }],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
        purposes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purpose' }],
        verified: Boolean,
        view: Number,
        rate: {
            drink: 0,
            position: 0,
            price: 0,
            service: 0,
            summary: 0,
            view: 0,
        },
        metaKeywords: String,
        menu: [],
        isHot: Boolean,
        social: [
            {
                type: String,
                name: String,
                link: String,
            },
        ],
        deleted: Boolean,
    },
    {
        timestamps: true,
    },
)

const Place = mongoose.model('Place', PlaceSchema)
module.exports = Place
