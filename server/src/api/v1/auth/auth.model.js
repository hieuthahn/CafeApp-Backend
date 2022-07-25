const mongoose = require('mongoose')
const config = require('../../config/auth.config')
const { v4: uuidv4 } = require('uuid')
const { user } = require('../../database')

const AuthSchema = new mongoose.Schema(
    {
        token: String,
        refreshToken: {
            token: String,
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            expiryDate: Date,
        },
    },
    {
        timestamps: true,
    },
)
AuthSchema.statics.saveRefreshToken = async function (user, refreshToken) {
    let expiredAt = new Date()
    const _token = refreshToken
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration)
    let _object = new this({
        refreshToken: {
            token: _token,
            user: user._id,
            expiryDate: expiredAt.getTime(),
        },
    })
    let auth = await _object.save()
    return auth.token
}
AuthSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime()
}
const Auth = mongoose.model('auths', AuthSchema)
module.exports = Auth
