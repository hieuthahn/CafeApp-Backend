const mongoose = require('mongoose')
const Tag = mongoose.model(
    'Tag',
    new mongoose.Schema(
        {
            name: String,
            slug: String,
            order: Number,
            isHot: Boolean,
            delete: Boolean,
            color: String,
        },
        { timestamps: true },
    ),
)
module.exports = Tag
