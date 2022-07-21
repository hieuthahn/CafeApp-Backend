const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: 'Access token not found' })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log(error)
        return res
            .status(403)
            .json({ success: false, message: 'Invalid token' })
    }
}

const isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).json({ success: false, message: err })
            return
        }

        if (user.role === 'admin') {
            next()
            return
        }

        res.status(403).json({ success: false, message: 'Require Admin Role!' })
        return
    })
}

module.exports = { verifyToken, isAdmin }
