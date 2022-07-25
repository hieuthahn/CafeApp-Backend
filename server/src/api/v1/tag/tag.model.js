const mongoose = require('mongoose')
const Tag = mongoose.model(
    'Tag',
    new mongoose.Schema({
        name: String,
        slug: String,
        order: Number,
        isHot: Boolean,
        delete: Boolean,
        color: String,
        updatedAt: Date,
        createdAt: Date,
    }),
)
module.exports = Tag
