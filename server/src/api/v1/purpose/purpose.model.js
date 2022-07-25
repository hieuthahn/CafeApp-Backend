const mongoose = require('mongoose')
const Purpose = mongoose.model(
    'Purpose',
    new mongoose.Schema(
        {
            name: String,
            slug: String,
            thumbnail: String,
            order: Number,
            isHot: Boolean,
            deleted: Boolean,
            color: String,
        },
        {
            timestamps: true,
        },
    ),
)
module.exports = Purpose
