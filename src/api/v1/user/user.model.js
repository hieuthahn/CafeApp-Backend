const mongoose = require('mongoose')
const User = mongoose.model(
    'User',
    new mongoose.Schema(
        {
            username: {
                type: 'string',
                required: true,
            },
            name: String,
            email: String,
            password: {
                type: 'string',
                required: true,
            },
            roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
            avatar: String,
            phone: String,
            facebook: String,
            instagram: String,
            publicSaved: Boolean,
            publicSocial: Boolean,
        },
        {
            timestamps: true,
        },
    ),
)
module.exports = User
