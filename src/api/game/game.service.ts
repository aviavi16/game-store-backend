import { getCollection } from '../../services/db.service'
import { fetchImageUrl } from '../../services/fetchImageUrl'
import loggerService from '../../services/logger.service'
import { fetchBggGameData } from '../../services/bgg.service'

export const gameService = {
  importGame,
  getAllGames,
  getGamesFromDate,
}

export async function importGame(name: string) {
  let description = ''
  let source = 'ai-generated'

  const imageUrl = await fetchImageUrl(name)
  let bggData = null
  try {
    bggData = await fetchBggGameData(name)
    if (bggData) {
      loggerService.info(`🎲 Fetched BGG data for "${name}"`)
    } else {
      loggerService.warn(`⚠️ No BGG data found for "${name}"`)
    }
  } catch (err) {
    loggerService.error(`❌ Failed to fetch BGG data for "${name}"`, err)
  }


  const now = new Date()
  const createdAt = now.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const gameToSave = {
    name,
    description,
    description_Heb: null,
    imageUrl,
    source,
    createdAt,
    createdAtTimestamp: now.getTime(),
    // 🔍 BGG metadata
    bgg: bggData || null,
  }

  try {
    const collection = await getCollection('game')
    await collection.insertOne(gameToSave)
    loggerService.info(`✅ Saved game "${name}" to database`)
  } catch (err) {
    loggerService.error(`❌ Failed to save game "${name}" to database`, err)
    throw err
  }

  return gameToSave
}

async function getAllGames() {
    const collection = await getCollection('game')
    const games = await collection.find().toArray()
    return games
  }

  async function getGamesFromDate(fromDate: string, includeMissing = false) {
    const timestamp = new Date(fromDate).getTime()
    if (isNaN(timestamp)) throw new Error('Invalid date format')
  
    const collection = await getCollection('game')
  
    const query = includeMissing
      ? {
          $or: [
            { createdAtTimestamp: { $gte: timestamp } },
            { createdAtTimestamp: { $exists: false } },
          ],
        }
      : {
          createdAtTimestamp: { $gte: timestamp },
        }
  
    const games = await collection.find(query).toArray()
    return games
  }
