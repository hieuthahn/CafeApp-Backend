const db = require('../../database')
const User = db.user
const Role = db.role
const { toSlug } = require('../helpers/utils')
const bcrypt = require('bcrypt')
const { findWithPagination } = require('./user.service')

exports.update = async (req, res) => {
    try {
        if (!req.body.password) {
            const data = await User.findByIdAndUpdate(req.userId, req.body, {
                fields: ['-password'],
                useFindAndModify: false,
            }).populate('roles', ['name'])

            if (data) {
                return res.status(200).send({
                    success: true,
                    message: 'Cập nhật profile thành công',
                    data,
                })
            }
        } else {
            const user = await User.findById(req.userId)
            const passwordIsValid = bcrypt.compareSync(
                req.body.password.old,
                user.password,
            )
            if (!passwordIsValid) {
                return res.status(400).send({
                    success: false,
                    message: 'Mật khẩu hiện tại không chính xác',
                })
            }
            if (req.body.password.confirm !== req.body.password.new) {
                return res.status(400).send({
                    success: false,
                    message: 'Nhập lại mật khẩu không chính xác',
                })
            }
            const body = {
                password: bcrypt.hashSync(req.body.password.new, 8),
            }
            const data = await User.findByIdAndUpdate(req.userId, body, {
                useFindAndModify: false,
            })

            if (data) {
                return res.status(200).send({
                    success: true,
                    message: 'Cập nhật profile thành công',
                })
            }
        }

        return res
            .status(403)
            .send({ success: false, message: 'Lưu profile không thành công' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error ' + error })
    }
}

exports.updateByAdmin = async (req, res) => {
    const profileId = req.params.id
    try {
        if (!req.body.password) {
            if (req.body.roles[0]) {
                const roles = await Role.find()
                const newRole = roles.filter((role) => {
                    return req.body.roles[0].name === role.name
                })
                req.body.roles[0] = newRole[0]._id
            }
            const data = await User.findByIdAndUpdate(profileId, req.body, {
                fields: ['-password'],
                useFindAndModify: false,
            }).populate('roles', ['name'])

            if (data) {
                return res.status(200).send({
                    success: true,
                    message: 'Cập nhật profile thành công',
                    data,
                })
            }
        } else {
            const user = await User.findById(req.userId)
            const passwordIsValid = bcrypt.compareSync(
                req.body.password.old,
                user.password,
            )
            if (!passwordIsValid) {
                return res.status(400).send({
                    success: false,
                    message: 'Mật khẩu hiện tại không chính xác',
                })
            }
            if (req.body.password.confirm !== req.body.password.new) {
                return res.status(400).send({
                    success: false,
                    message: 'Nhập lại mật khẩu không chính xác',
                })
            }
            const body = {
                password: bcrypt.hashSync(req.body.password.new, 8),
            }
            const data = await User.findByIdAndUpdate(req.userId, body, {
                useFindAndModify: false,
            })

            if (data) {
                return res.status(200).send({
                    success: true,
                    message: 'Cập nhật profile thành công',
                })
            }
        }

        return res
            .status(403)
            .send({ success: false, message: 'Lưu profile không thành công' })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error ' + error })
    }
}

exports.findOne = async (req, res) => {
    try {
        if (!req.userId) {
            return res
                .status(200)
                .send({ success: false, message: 'Không tìm thấy user id' })
        }
        const data = await User.findById(req.userId)
        if (data) {
            return res.status(200).send({
                success: true,
                data: {
                    username: data.username,
                    name: data.name,
                    email: data.email ?? '',
                    phone: data.phone ?? '',
                    password: data.password ? true : false,
                    publicSaved: data.publicSaved ?? '',
                    publicSocial: data.publicSocial ?? '',
                    facebook: data.facebook ?? '',
                    instagram: data.instagram ?? '',
                },
            })
        }
        return res.status(404).send({
            success: false,
            message: 'Không tìm thấy User với id ' + id,
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: error })
    }
}

exports.updateAvatar = async (req, res) => {
    try {
        const avatar = req.files.avatar
            ? req.files.photo.map((image) => ({
                  url: image?.path,
                  filename: image?.filename,
                  originalName: image?.originalname,
                  size: image?.size,
              }))
            : []
        const body = {
            avatar: avatar,
        }
        const data = await User.findByIdAndUpdate(req.userId, body, {
            useFindAndModify: false,
        })

        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Cập nhật ảnh đại diện thành công',
            })
        }
        return res.status(400).send({
            success: false,
            message: 'Cập nhật ảnh đại diện không thành công',
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error ' + error })
    }
}

exports.findAllByAdmin = async (req, res) => {
    const name = req.query.name
    const userId = req.userId
    const { page = 1, pageSize } = req.query
    const condition = userId ? { author: userId } : {}
    try {
        const result = await findWithPagination(
            {} || condition,
            +page,
            +pageSize,
        )

        if (result.data) {
            return res.status(200).send({
                success: true,
                data: result.data,
                meta: {
                    totalPages: res.totalPages,
                    currentPage: result.currentPage,
                    pageSize: result.pageSize,
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                },
            })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Users',
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error ' + error.message,
        })
    }
}

exports.deleteById = async (req, res) => {
    const id = req.params.id
    try {
        const data = await User.findByIdAndRemove(id)
        if (data) {
            return res.status(200).send({
                success: true,
                message: 'Xóa người dùng thành công!',
            })
        }
        return res.status(404).send({
            success: false,
            message: `Không thể xóa người dùng, id=${id}.`,
        })
    } catch (error) {
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' })
    }
}

exports.allAccess = (req, res) => {
    res.status(200).send('Public Content.')
}
exports.userBoard = (req, res) => {
    res.status(200).send('User Content')
}
exports.adminBoard = (req, res) => {
    res.status(200).send('Admin Content')
}
exports.moderatorBoard = (req, res) => {
    res.status(200).send('Modertor Content')
}
