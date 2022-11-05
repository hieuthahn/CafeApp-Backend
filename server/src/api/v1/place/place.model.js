const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const PlaceSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'published', 'rejected'],
            default: 'pending',
        },
        name: { type: String, required: true },
        slug: { type: String, slug: 'name' },
        address: {
            geo: {
                lat: String,
                lng: String,
            },
            desc: String,
            specific: { type: String, required: true },
        },
        intro: String,
        wifi: { name: String, password: String },
        avgRate: Number,
        imageCount: Number,
        openingStatus: String,
        time: {
            open: String,
            close: String,
        },
        openingType: String,
        price: {
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
        // benefits: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Benefit',
        //     },
        // ],
        benefits: [],
        region: String,
        tags: [],
        purposes: [],
        // regions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' }],
        // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
        // purposes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purpose' }],
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
        email: String,
        facebook: String,
        instagram: String,
        website: String,
        deleted: Boolean,
    },
    {
        timestamps: true,
    },
)

const Place = mongoose.model('Place', PlaceSchema)
module.exports = Place
