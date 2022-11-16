const mongoose = require('mongoose')

const Like = mongoose.model(
    'Like',
    new mongoose.Schema(
        {
            place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
            author: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
        },
        {
            timestamps: true,
        },
    ),
)
module.exports = Like
