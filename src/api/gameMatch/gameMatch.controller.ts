import { Request, Response } from 'express'
import { fetchHotBoardGameNames } from '../../services/bgg.service'
import loggerService from '../../services/logger.service'

export async function getHotGames(req: Request, res: Response) {
    try {
      loggerService.info('🔥 Fetching hot games from BGG...')
      const hotGames = await fetchHotBoardGameNames()
      loggerService.info(`✅ Retrieved ${hotGames.length} hot games from BGG`)
      res.json(hotGames)
    } catch (err) {
      loggerService.error('❌ Failed to fetch hot games from BGG', err)
      res.status(500).json({ error: 'Failed to fetch hot games from BGG' })
    }
  }