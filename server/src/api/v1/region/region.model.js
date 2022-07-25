const mongoose = require('mongoose')
const Region = mongoose.model(
    'Region',
    new mongoose.Schema(
        {
            name: String,
            slug: String,
            thumbnail: String,
            order: Number,
            isHot: Boolean,
            deleted: Boolean,
        },
        {
            timestamps: true,
        },
    ),
)
module.exports = Region
