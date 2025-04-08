import { chromium } from 'playwright'
import logger from './logger.service'

export async function fetchPhilibertImageWithPlaywright(gameName: string): Promise<string | null> {
  const searchUrl = `https://www.philibertnet.com/en/search?search_query=${encodeURIComponent(gameName)}`
  logger.info(`🎯 [Playwright] Starting image scrape for "${gameName}"`)

  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    logger.info(`🌍 Navigating to: ${searchUrl}`)
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })

    const firstProductLink = await page.getAttribute('.product_img_link', 'href')
    if (!firstProductLink) {
      logger.warn(`⚠️ No product link found for "${gameName}"`)
      return null
    }

    const productUrl = firstProductLink.startsWith('http') ? firstProductLink : `https://www.philibertnet.com${firstProductLink}`
    logger.info(`🔗 Found product page: ${productUrl}`)

    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })

    const imageUrl = await page.getAttribute('#bigpic', 'src')
    if (imageUrl) {
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`
      logger.info(`✅ [Playwright] Found image for "${gameName}": ${fullUrl}`)
      return fullUrl
    } else {
      logger.warn(`⚠️ No image found on product page for "${gameName}"`)
      return null
    }
  } catch (err: any) {
    logger.error(`❌ [Playwright] Error fetching Philibert image for "${gameName}"`, { message: err.message })
    return null
  } finally {
    if (browser) {
      logger.info(`🧹 [Playwright] Closing browser`)
      await browser.close()
    }
  }
}
