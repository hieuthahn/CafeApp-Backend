const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { verifyToken, isAdmin } = require('../middleware/auth')

const utils = require('../lib/utils')

const User = require('../models/User')

const isRequiredField = (field, res, message) => {
    if (!field) {
        return res.status(400).json({ success: false, message: message })
    }
}

// @route GET api/auth
// @desc Check if user is logged
// @access Public
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            res.status(400).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
})

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
    const { name, password, email } = req.body

    // Simple  validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email hoặc tên người dùng không được để trống',
        })
    }

    try {
        //Check for existing user
        const user = await User.findOne({ email })
        if (user) {
            return res
                .status(400)
                .json({ success: false, message: 'Địa chỉ email đã tồn tại' })
        }

        // All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            name,
            username: utils.toLowerCaseTrim(name),
            password: hashedPassword,
            email,
            publicSocial: true,
            publicSaved: true,
            avartar: '',
        })
        await newUser.save()

        // Return verifyToken
        const accessToken = jwt.sign(
            {
                userId: newUser._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
        )

        res.json({
            success: true,
            message: 'Tạo tài khoản thành công.',
            accessToken: accessToken,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
})

// @route POST api/auth/login
// @desc login user
// @access Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    // Simple validate
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email hoặc tên người dùng không được để trống',
        })
    }

    try {
        // Check for existing user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ email hoặc mật khẩu không chính xác',
            })
        }

        // User found
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ email hoặc mật khẩu không chính xác',
            })
        }

        // All good
        // Return token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
        )

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            accessToken: accessToken,
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi server' })
    }
})

// @route PUT api/auth/
// @desc Update user
// @access Private
router.put('/update', verifyToken, async (req, res) => {
    const {
        name,
        email,
        username,
        publicSocial,
        publicSaved,
        avatar,
        id,
        role,
    } = req.body

    // Simple  validation
    // if (!name) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Tên hiển thị phải lớn hơn 3 ký tự',
    //     })
    // }

    // if (!username) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Tên người dùng phải lớn hơn 3 ký tự',
    //     })
    // }

    try {
        // let updatedUser = {
        //     name: name,
        //     username: utils.toLowerCaseTrim(username),
        //     email: email || '',
        //     publicSocial: publicSocial || true,
        //     publicSaved: publicSaved || true,
        //     avartar: avatar || '',
        // }
        const userUpdateCondition = { _id: id, user: req.userId }

        updatedUser = await User.findOneAndUpdate(
            userUpdateCondition,
            req.body,
            { new: true },
        ).select('-password')

        // User not authorized to update user
        if (!updatedUser) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy người dùng',
            })
        } else {
            return res.json({
                success: true,
                message: 'Cập nhật thông tin thành công',
                updatedUser: updatedUser,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
})

// @route DELETE apit/posts
// @desc Delete post
// @access Private
router.delete('/delete', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.body
    try {
        const userDeleteCondition = {
            _id: id,
            user: req.userId,
        }
        const deletedUser = await User.findOneAndDelete(userDeleteCondition)

        // User not authorized or user not found
        if (!deletedUser) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy người dùng',
            })
        } else {
            return res.json({
                success: true,
                message: 'Xóa người dùng thành công',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
})

module.exports = router
