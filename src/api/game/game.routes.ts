import express from 'express'
import { importGame, getGames, getGamesFromDate } from './game.controller'

const router = express.Router()

router.post('/import', importGame)
router.get('/', getGames)
router.get('/from-date', getGamesFromDate)

export const gameRoutes = router
