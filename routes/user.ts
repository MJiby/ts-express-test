import express from 'express'
import { Request } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/user'


const router = express.Router()

router.get('/', (req, res) => {
    const user = req.user!.toJSON() as User
    return res.json({ ...user, password: null }) // delete user.password 해도 괜춘
})


router.post('/', async (req, res, next) => {
    try {
        // 아이디가 기존에 있는 거라면
        const exUser = await User.findOne({
            where: {
                // 테이블 칼럼
                userId: req.body.userId
            }
        })
        if (exUser) {
            return res.status(403).send('이미 사용 중인 아이디입니다.')
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        })

        return res.status(200).json(newUser)

    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    // try {
    //     const user = await User.findOne({
    //         where: { id: parseInt(req.params.id, 10) },
    //         include: [{
    //             model: Lectures
    //         }]
    //     })
    // } catch (error) {

    // }
    return res.send("아직 작성중...")
})


export default router;