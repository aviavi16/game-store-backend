import express from 'express'
import { register, login, guestLogin } from './auth.controller'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/guest', guestLogin)

export const authRoutes = router
