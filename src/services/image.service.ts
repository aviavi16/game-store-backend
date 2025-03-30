import axios from 'axios'
import { config } from '../config/config'

export async function fetchImageUrl(gameName: string): Promise<string | null> {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: `${gameName} board game`,
        per_page: 1,
        orientation: 'squarish',
      },
      headers: {
        Authorization: `Client-ID ${config.unsplashApiKey}`,
      }
    })

    const results = response.data.results
    if (results.length > 0) {
      return results[0].urls.small
    }

    return null
  } catch (err) {
    console.error('❌ Error fetching image from Unsplash:', err)
    return null
  }
}
