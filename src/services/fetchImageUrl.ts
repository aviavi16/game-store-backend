import axios from 'axios'
import { config } from '../config/config'
import loggerService from './logger.service'

export async function fetchImageUrl(gameName: string): Promise<string | null> {
  const query = `${gameName} board game`

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: config.googleApiKey,
        cx: config.googleSearchEngineId,
        q: query,
        searchType: 'image',
        num: 3,
        safe: 'medium',
      },
    })

    const items = response.data.items
    if (items && items.length > 0) {
      // בודק שהתמונה באמת חוקית (יש לה לינק עם סיומת jpg/png)
      const validImage = items.find((item: any) =>
        item.link && /\.(jpg|jpeg|png)$/i.test(item.link)
      )

      if (validImage) {
        const imageUrl = validImage.link
        loggerService.info(`📸 Google image selected for "${query}": ${imageUrl}`)
        return imageUrl
      } else {
        loggerService.warn(`⚠️ All image results invalid for "${query}"`)
        return null
      }
    } else {
      loggerService.warn(`⚠️ No image results returned for "${query}"`)
      return null
    }

  } catch (err: any) {
    loggerService.error(`❌ Google CSE error for "${query}"`, {
      message: err.message,
      status: err.response?.status,
      response: err.response?.data,
    })
    return null
  }
}