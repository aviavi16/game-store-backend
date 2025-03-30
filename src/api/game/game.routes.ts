import express from 'express'
import { importGame, getAllGames, getGamesFromDate } from './game.controller'

const router = express.Router()

router.post('/import', importGame)
router.get('/all', getAllGames) 
router.get('/from-date', getGamesFromDate)

export const gameRoutes = router
