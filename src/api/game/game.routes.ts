import express from 'express'
import { importGame, importBulkGames, getAllGames, getGamesFromDate, removeGame , importHotGamesController, deleteGamesBulk} from './game.controller'

const router = express.Router()

router.post('/import', importGame)
router.post('/import-bulk', importBulkGames)
router.get('/all', getAllGames) 
router.delete('/remove', removeGame) 
router.get('/from-date', getGamesFromDate)
router.post('/import-hot', importHotGamesController)
router.post('/delete-bulk', deleteGamesBulk)

export const gameRoutes = router
