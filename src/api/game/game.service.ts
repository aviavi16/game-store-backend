import { getCollection } from '../../services/db.service'
import { fetchImageUrl } from '../../services/fetchImageUrl'
import loggerService from '../../services/logger.service'
import { fetchBggGameData } from '../../services/bgg.service'
import { fetchPhilibertImageWithPlaywright } from '../../services/philibert.service'
import { fetchAmazonPrice } from '../../services/priceCompare.service'
import { timeoutPromise } from '../../utils/timeoutPromise' // adjust path as needed

export const gameService = {
  importGame,
  importBulkGames,
  getAllGames,
  getGamesFromDate,
}

export async function importGame(name: string) {
  let description = ''
  let source = 'ai-generated'
  const fallbackImage = await fetchPhilibertImageWithPlaywright(name)
  if (fallbackImage) {
    loggerService.info(`🛍️ Philibert image used for "${name}": ${fallbackImage}`)
  } else {
    loggerService.warn(`⚠️ No Philibert image found for "${name}"`)
  }
  
  const googleImage = await fetchImageUrl(name)
  if (googleImage) {
    loggerService.info(`📸 Google image used for "${name}": ${googleImage}`)
  } else {
    loggerService.warn(`⚠️ No Google image found for "${name}"`)
  }

  const imageUrl = fallbackImage || googleImage

  if (!imageUrl) {
    loggerService.error(`❌ Failed to fetch any image for "${name}" from both Philibert and Google`)
  }

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

  let amazonPrice: number | null = null
  try {
    amazonPrice = await fetchAmazonPrice(name)
    if (amazonPrice !== null) {
      loggerService.info(`💰 Fetched Amazon price for "${name}": $${amazonPrice}`)
    } else {
      loggerService.warn(`⚠️ No Amazon price found for "${name}"`)
    }
  } catch (err) {
    loggerService.error(`❌ Failed to fetch Amazon price for "${name}"`, err)
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
    imageUrl_Store: fallbackImage || null,
    source,
    createdAt,
    createdAtTimestamp: now.getTime(),
    amazonPrice,
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

async function importBulkGames(names: string[]) {
  const importedGames: { name: string; status: string; game: any }[] = []
  const failedGames: { name: string; status: string; error: string }[] = []

  const gameImportPromises = names.map(async (name) => {
    try {
      loggerService.info(`Importing game "${name}"`)
      const game = await timeoutPromise(importGame(name), 15000, name)
      loggerService.info(`✅ Successfully imported "${name}"`)
      importedGames.push({ name, status: 'success', game })
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      loggerService.error(`❌ Failed to import "${name}": ${errorMsg}`)
      failedGames.push({ name, status: 'failed', error: errorMsg })
    }
  })

  await Promise.allSettled(gameImportPromises)

  loggerService.info(
    `Bulk import completed: ${importedGames.length} success, ${failedGames.length} failed.`
  )

  return { importedGames, failedGames }
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
