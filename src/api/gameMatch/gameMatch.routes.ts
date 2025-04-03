import express from 'express'
import { getHotGames } from './gameMatch.controller'
import { authRoutes } from './auth/auth.routes'
import { requireAuth } from '../../middlewares/requireAuth'

const router = express.Router()

router.use('/auth', authRoutes)
router.get('/hot', getHotGames)
router.get('/secure-test', requireAuth, (req, res) => {
    res.send({ msg: `Welcome ${req.user?.username}!`, userId: req.user?._id })
  })
export const gameMatchRoutes = router