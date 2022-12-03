const mongoose = require('mongoose')

const Review = mongoose.model(
    'Review',
    new mongoose.Schema(
        {
            title: { type: String, required: true },
            content: { type: String, required: true },
            rate: { type: Object, required: true },
            place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            canEdit: Boolean,
            images: Array,
            like: { type: mongoose.Schema.Types.ObjectId, ref: 'Like' },
            slug: String,
            anonymous: Boolean,
        },
        {
            timestamps: true,
        },
    ),
)
module.exports = Review
