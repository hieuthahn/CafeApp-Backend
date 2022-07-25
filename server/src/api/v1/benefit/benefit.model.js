const mongoose = require('mongoose')
const Benefit = mongoose.model(
    'Benefit',
    new mongoose.Schema(
        {
            name: String,
            slug: String,
            icon: String,
            order: Number,
            deleted: Boolean,
            color: String,
        },
        {
            timestamps: true,
        },
    ),
)
module.exports = Benefit
