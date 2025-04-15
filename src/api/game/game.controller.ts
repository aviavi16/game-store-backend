import { RequestHandler } from 'express'
import { gameService, importHotGames  } from './game.service'
import loggerService from '../../services/logger.service'

export const importGame: RequestHandler = async (req, res) => {
  console.log('📥 Received import request for:', req.query.name); 
  const { name } = req.query
  if (!name || typeof name !== 'string') {
    res.status(400).send('Game name is required')
    return
  }

  try {
    loggerService.info(`Importing game: ${name}`)
    const game = await gameService.importGame(name)
    res.json(game)
  } catch (err) {
    loggerService.error('❌ Failed to import game', err)
    res.status(500).send('Could not import game')
  }
}

export const importBulkGames: RequestHandler = async (req, res) => {
  const { names } = req.body

  if (!Array.isArray(names) || names.length === 0) {
    res.status(400).send('Array of game names is required')
    return
  }

  loggerService.info(`🧩 Starting bulk import of ${names.length} games`)

  try {
    const results = await gameService.importBulkGames(names)
    res.json(results)
  } catch (err) {
    loggerService.error('❌ Bulk import failed', err)
    res.status(500).send('Bulk import failed')
  }
}

export const getAllGames: RequestHandler = async (req, res) => {
  try {
    const games = await gameService.getAllGames()
    res.json(games)
  } catch (err) {
    loggerService.error('❌ Failed to get games', err)
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
      loggerService.warn(`⚠️ No games found from date: ${fromDate}`)
      console.warn(`⚠️ No games found from date: ${fromDate}`)
    } else {
      loggerService.info(`📄 ${games.length} games found from ${fromDate}`)
    }

    res.json(games)
  } catch (err) {
    loggerService.error('❌ Failed to fetch games by date', err)
    res.status(500).send('Could not fetch games')
  }
}

export const removeGame: RequestHandler = async (req, res) => {
  const { name } = req.query
  if (!name || typeof name !== 'string') {
    res.status(400).send('Game name is required for deletion')
    return
  }

  try {
    const result = await gameService.removeGame(name)
    if (result.deletedCount === 0) {
      loggerService.warn(`⚠️ No game found to delete: "${name}"`)
      res.status(404).send('Game not found')
      return
    }

    loggerService.info(`🗑️ Deleted game: "${name}"`)
    res.json({ message: `Game "${name}" deleted` })
  } catch (err) {
    loggerService.error(`❌ Failed to delete game: "${name}"`, err)
    res.status(500).send('Failed to delete game')
  }
}

export const importHotGamesController: RequestHandler = async (_req, res) => {
  try {
    const result = await importHotGames()
    res.json(result)
  } catch (err) {
    loggerService.error('❌ Failed to import hot games', err)
    res.status(500).send('Import failed')
  }
}


