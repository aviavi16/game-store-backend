import axios from 'axios'
import { config } from '../config/config'
import loggerService from '../services/logger.service'

let isFetching = false // נעילה

export async function fetchImageUrl(gameName: string): Promise<string | null> {
  if (isFetching) {
    loggerService.warn(`🚫 Skipping image fetch for "${gameName}" — already fetching another image.`)
    return null
  }

  isFetching = true
  const url = 'https://api.unsplash.com/search/photos'
  const query = `${gameName} board game`

  try {
    const response = await axios.get(url, {
      params: {
        query,
        per_page: 1,
        orientation: 'squarish',
      },
      headers: {
        Authorization: `Client-ID ${config.unsplashApiKey}`,
      },
    })

    const results = response.data.results

    if (results.length > 0) {
      const imageUrl = results[0].urls.small
      loggerService.info(`📸 Unsplash image found for "${query}": ${imageUrl}`)
      return imageUrl
    } else {
      loggerService.warn(`⚠️ No Unsplash image results for "${query}"`)
      return null
    }
  } catch (err: any) {
    loggerService.error(`❌ Unsplash API error for "${query}"`, {
      message: err.message,
      status: err.response?.status,
      response: err.response?.data,
    })
    return null
  } finally {
    isFetching = false
  }
}
