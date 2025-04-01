import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import logger from './logger.service'

interface BggGameData {
  description: string
  minPlayers: number
  maxPlayers: number
  playingTime: number
  complexity: number
  mechanics: string[]
  categories: string[]
}

export async function fetchBggGameData(gameName: string): Promise<BggGameData | null> {
  try {
    logger.info(`🔍 Searching BGG for "${gameName}"`)

    const searchRes = await axios.get('https://boardgamegeek.com/xmlapi2/search', {
      params: { query: gameName, type: 'boardgame' },
    })

    const searchData = await parseStringPromise(searchRes.data)
    const firstItem = searchData.items?.item?.[0]

    if (!firstItem || !firstItem.$?.id) {
      logger.warn(`⚠️ No BGG search results found for "${gameName}"`)
      return null
    }

    const gameId = firstItem.$.id
    logger.info(`🔗 BGG ID for "${gameName}": ${gameId}`)

    const thingRes = await axios.get('https://boardgamegeek.com/xmlapi2/thing', {
      params: { id: gameId, stats: 1 },
    })

    const thingData = await parseStringPromise(thingRes.data)
    const item = thingData.items?.item?.[0]

    if (!item) {
      logger.warn(`⚠️ No BGG details returned for game "${gameName}"`)
      return null
    }

    const description = item.description?.[0] || ''
    const minPlayers = parseInt(item.minplayers?.[0]?.$.value || '0')
    const maxPlayers = parseInt(item.maxplayers?.[0]?.$.value || '0')
    const playingTime = parseInt(item.playingtime?.[0]?.$.value || '0')
    const complexity = parseFloat(item.statistics?.[0]?.ratings?.[0]?.averageweight?.[0]?.$.value || '0')

    const mechanics = (item.link || [])
      .filter((l: any) => l.$.type === 'boardgamemechanic')
      .map((l: any) => l.$.value)

    const categories = (item.link || [])
      .filter((l: any) => l.$.type === 'boardgamecategory')
      .map((l: any) => l.$.value)

    logger.info(`✅ Fetched BGG data for "${gameName}" successfully`)

    return {
      description,
      minPlayers,
      maxPlayers,
      playingTime,
      complexity,
      mechanics,
      categories,
    }

  } catch (err: any) {
    logger.error(`❌ BGG fetch error for "${gameName}"`, {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    })
    return null
  }
}
