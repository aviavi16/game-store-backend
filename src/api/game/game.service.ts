import { getCollection } from '../../services/db.service'
import { generateDescription } from '../../services/openai.service'
import { fetchImageUrl } from '../../services/image.service'
import { logger } from '../../services/logger.service'

export const gameService = {
  importGame,
  getAllGames,
  getGamesFromDate,
}

async function importGame(name: string) {
  let description = ''
  let source = 'ai-generated'

  try {
    description = await generateDescription(name)
  } catch (err) {
    source = 'fallback_due_to_openai_quota_exceeded'
    description = `No description available for "${name}".`

    logger.warn(`⚠️ OpenAI quota exceeded – fallback description used for "${name}"`)
    console.warn(`⚠️ Used fallback for "${name}" due to OpenAI quota limit`)
  }

  const imageUrl = await fetchImageUrl(name)

  const now = new Date()
  const createdAt = now.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) // תוצאה לדוגמה: "30/03/2025, 13:45"

  const gameToSave = {
    name,
    description,
    description_Heb: null,
    imageUrl,
    source,
    createdAt,
    createdAtTimestamp: now.getTime(),
  }

  const collection = await getCollection('game')
  await collection.insertOne(gameToSave)

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
