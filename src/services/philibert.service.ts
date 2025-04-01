import axios from 'axios'
import * as cheerio from 'cheerio'
import loggerService from './logger.service'

export async function fetchPhilibertImage(gameName: string): Promise<string | null> {
  const searchUrl = `https://www.philibertnet.com/en/search?search_query=${encodeURIComponent(gameName)}`
  loggerService.info(`🔍 Searching Philibert for "${gameName}"...`)

  try {
    const searchResponse = await axios.get(searchUrl)
    const $search = cheerio.load(searchResponse.data)

    // מציאת לינק לעמוד המוצר הראשון
    const firstProductLink = $search('.product_img_link').first().attr('href')
    if (!firstProductLink) {
      loggerService.warn(`⚠️ No product page found for "${gameName}" on Philibert`)
      return null
    }

    // שלב 2: כניסה לעמוד המוצר עצמו
    const productResponse = await axios.get(firstProductLink)
    const $product = cheerio.load(productResponse.data)

    // נסה לשלוף את התמונה הראשית באיכות גבוהה
    const imgSrc = $product('#bigpic').attr('src')

    if (imgSrc) {
      const fullUrl = imgSrc.startsWith('http') ? imgSrc : `https:${imgSrc}`
      loggerService.info(`🛍️ High-res image found for "${gameName}": ${fullUrl}`)
      return fullUrl
    }

    loggerService.warn(`⚠️ Product page loaded but no image found for "${gameName}"`)
    return null
  } catch (err: any) {
    loggerService.error(`❌ Error fetching Philibert image for "${gameName}"`, {
      message: err.message,
      status: err.response?.status,
    })
    return null
  }
}
