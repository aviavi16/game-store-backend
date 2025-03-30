import { RequestHandler } from 'express'
import { gameService } from './game.service'
import { logger } from '../../services/logger.service'

export const importGame: RequestHandler = async (req, res) => {
  const { name } = req.query
  if (!name || typeof name !== 'string') {
    res.status(400).send('Game name is required')
    return
  }

  try {
    logger.info(`Importing game: ${name}`)
    const game = await gameService.importGame(name)
    res.json(game)
  } catch (err) {
    logger.error('❌ Failed to import game', err)
    res.status(500).send('Could not import game')
  }
}

export const getGames: RequestHandler = async (req, res) => {
  try {
    const games = await gameService.getAllGames()
    res.json(games)
  } catch (err) {
    logger.error('❌ Failed to get games', err)
    res.status(500).send('Could not fetch games')
  }
}
  
export const getGamesFromDate: RequestHandler = async (req, res) => {
  const { fromDate, includeMissing } = req.query

  if (!fromDate || typeof fromDate !== 'string') {
    res.status(400).send('fromDate query param is required')
    return
  }

  const includeMissingBool = includeMissing === 'true'

  try {
    const games = await gameService.getGamesFromDate(fromDate, includeMissingBool)

    if (!games.length) {
      logger.warn(`⚠️ No games found from date: ${fromDate}`)
      console.warn(`⚠️ No games found from date: ${fromDate}`)
    } else {
      logger.info(`📄 ${games.length} games found from ${fromDate}`)
    }

    res.json(games)
  } catch (err) {
    logger.error('❌ Failed to fetch games by date', err)
    res.status(500).send('Could not fetch games')
  }
}


