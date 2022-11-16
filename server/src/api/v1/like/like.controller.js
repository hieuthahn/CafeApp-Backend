const db = require('../../database')
const Like = db.like

exports.create = async (req, res) => {
    const placeId = req.params.placeId

    const userId = req.userId
    if (!userId) {
        return res.status(403).send({
            success: false,
            message: 'Bạn cần đăng nhập để tiếp tục',
        })
    }

    if (!placeId) {
        return res.status(403).send({
            success: false,
            message: 'Không tìm thấy địa điểm',
        })
    }

    const like = new Like({
        place: placeId,
        author: [userId],
    })

    try {
        const placeLikeExisted = await Like.findOne({ place: placeId })
        if (!placeLikeExisted) {
            const data = await Like.create(like)
            if (data) {
                return res.status(200).send({ success: true, data })
            }

            return res.status(403).send({
                success: false,
                message: 'Can not save to database!' + data,
            })
        }

        const userLikeExisted = await Like.findOne({
            place: placeId,
            author: { $in: userId },
        })

        if (userLikeExisted) {
            const data = await Like.updateOne(
                {
                    place: placeId,
                },
                { $pull: { author: userId } },
            )
            if (data) {
                return res.status(200).send({
                    success: true,
                    message: 'Bỏ thích thành công',
                    data,
                })
            }
        } else {
            const data = await Like.updateOne(
                {
                    place: placeId,
                },
                { $push: { author: userId } },
            )
            if (data) {
                return res.status(200).send({
                    success: true,
                    message: 'Đã thích',
                    data,
                })
            }
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error' + error,
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        const data = await Like.find()

        if (data) {
            return res.status(200).send({
                success: true,
                data: data,
            })
        }

        return res.status(404).send({
            success: false,
            message: 'Not found Review with name ' + name,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Internal server error',
        })
    }
}

exports.findByPlaceId = async (req, res) => {
    const placeId = req.params?.placeId

    try {
        if (placeId.match(/^[0-9a-fA-F]{24}$/)) {
            const result = await Like.findOne({ place: placeId }).lean()
            result.likeCount = result.author.length
            if (result) {
                return res.status(200).send({
                    success: true,
                    data: result,
                })
            }
        } else {
            return res
                .status(400)
                .send({ success: false, message: 'Id bài viết không hợp lệ' })
        }

        return res
            .status(200)
            .send({ success: false, message: 'Not found Review with ' + id })
    } catch (error) {
        return res.status(500).send({ success: false, message: error })
    }
}
