import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import loggerService from './logger.service'

export async function fetchStorePrice(storeUrl: string, gameName: string): Promise<number | null> {
  loggerService.info(`🛒 Fetching store price from "${storeUrl}" for "${gameName}"`)

  try {
    const searchUrl = `${storeUrl}/search?q=${encodeURIComponent(gameName)}`
    const response = await fetch(searchUrl)
    const html = await response.text()
    const $ = cheerio.load(html)

    const priceText = $('.price, .product-price, .product .price').first().text().trim()

    if (!priceText) {
      loggerService.warn(`⚠️ No price text found on ${storeUrl} for "${gameName}"`)
      return null
    }

    const match = priceText.replace(',', '').match(/([\d.]+)/)
    const price = match ? parseFloat(match[1]) : null

    if (price !== null) {
      loggerService.info(`✅ Store price for "${gameName}": ₪${price}`)
    } else {
      loggerService.warn(`⚠️ Unable to parse price from "${priceText}" on ${storeUrl}`)
    }

    return price
  } catch (err) {
    loggerService.error(`❌ Error fetching store price from ${storeUrl} for "${gameName}"`, err)
    return null
  }
}

export async function fetchAmazonPrice(gameName: string): Promise<number | null> {
    loggerService.info(`🌍 Fetching Amazon price for "${gameName}" via ScraperAPI`)
  
    const apiKey = process.env.SCRAPERAPI_KEY
    if (!apiKey) {
      loggerService.error('❌ SCRAPERAPI_KEY missing from env')
      return null
    }
  
    const query = encodeURIComponent(`${gameName} board game`)
    const targetUrl = `https://www.amazon.com/s?k=${query}`
    const scrapeUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${targetUrl}`
  
    try {
      const res = await fetch(scrapeUrl)
      const html = await res.text()
      const $ = cheerio.load(html)
  
      const priceText = $('.a-price-whole').first().text().trim()
      if (!priceText) {
        loggerService.warn(`⚠️ No Amazon price found for "${gameName}"`)
        return null
      }
  
      const match = priceText.replace(',', '').match(/([\d.]+)/)
      const price = match ? parseFloat(match[1]) : null
  
      if (price !== null) {
        loggerService.info(`✅ Amazon price for "${gameName}": $${price}`)
      } else {
        loggerService.warn(`⚠️ Could not parse Amazon price for "${gameName}"`)
      }
  
      return price
    } catch (err) {
      loggerService.error(`❌ Failed to fetch Amazon price for "${gameName}"`, err)
      return null
    }
  }

export async function comparePrices(storeUrl: string, gameName: string) {
  loggerService.info(`🔍 Comparing store and Amazon prices for "${gameName}"`)

  const storePrice = await fetchStorePrice(storeUrl, gameName)
  const amazonPrice = await fetchAmazonPrice(gameName)

  loggerService.info(
    `📊 Price comparison for "${gameName}": Store = ${storePrice ?? 'N/A'}, Amazon = ${amazonPrice ?? 'N/A'}`
  )

  return {
    game: gameName,
    storePrice,
    amazonPrice,
  }
}
