const mongoose = require('mongoose')

const Promos = mongoose.model(
    'Promos',
    new mongoose.Schema(
        {
            title: { type: String, required: true },
            description: { type: String },
            place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            images: Array,
            showing: Boolean,
            time: {},
        },
        {
            timestamps: true,
        },
    ),
)
module.exports = Promos
