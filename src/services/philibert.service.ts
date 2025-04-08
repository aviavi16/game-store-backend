import axios from 'axios'
import * as cheerio from 'cheerio'
import loggerService from './logger.service'

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
}

export async function fetchPhilibertImage(gameName: string): Promise<string | null> {
  const searchUrl = `https://www.philibertnet.com/en/search?search_query=${encodeURIComponent(gameName)}`
  loggerService.info(`🔍 Searching Philibert for "${gameName}"...`)

  try {
    const searchResponse = await axios.get(searchUrl, { headers: HEADERS })
    const $search = cheerio.load(searchResponse.data)

    const firstProductLink = $search('.product_img_link').first().attr('href')
    if (!firstProductLink) {
      loggerService.warn(`⚠️ No product page found for "${gameName}" on Philibert`)
      return null
    }

    const productResponse = await axios.get(firstProductLink, { headers: HEADERS })
    const $product = cheerio.load(productResponse.data)

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
