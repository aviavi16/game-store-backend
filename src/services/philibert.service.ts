import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import logger from './logger.service'

puppeteer.use(StealthPlugin())

const PHILIBERT_BASE_URL = 'https://www.philibertnet.com/en/search?search_query='

export async function fetchPhilibertImageWithPuppeteer(gameName: string): Promise<string | null> {
  const searchUrl = `${PHILIBERT_BASE_URL}${encodeURIComponent(gameName)}`
  logger.info(`🕵️‍♂️ [Puppeteer] Starting image scrape for "${gameName}" on Philibert`)

  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,      
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Memory monitoring
    const memCheckInterval = setInterval(async () => {
      const metrics = await page.metrics()
      const heapSize = metrics.JSHeapUsedSize

      if (heapSize && heapSize > 100 * 1024 * 1024) {
        logger.warn(`⚠️ High memory usage: ${Math.round(heapSize / 1024 / 1024)} MB`)
      }
    }, 1000)

    logger.info(`🌍 Navigating to search page: ${searchUrl}`)
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })

    const productLink = await page.$eval('.product_img_link', (el) => (el as HTMLAnchorElement).href).catch(() => null)
    if (!productLink) {
      logger.warn(`❌ No product link found for "${gameName}"`)
      return null
    }

    logger.info(`🔗 Navigating to product page: ${productLink}`)
    await page.goto(productLink, { waitUntil: 'domcontentloaded', timeout: 20000 })

    const imageUrl = await page.$eval('#bigpic', (img) => (img as HTMLImageElement).src).catch(() => null)
    if (imageUrl) {
      logger.info(`✅ [Puppeteer] Found image for "${gameName}": ${imageUrl}`)
    } else {
      logger.warn(`⚠️ [Puppeteer] No image found on product page for "${gameName}"`)
    }

    return imageUrl || null
  } catch (err: any) {
    logger.error(`🚨 [Puppeteer] Error while scraping Philibert for "${gameName}"`, {
      message: err.message,
    })
    return null
  } finally {
    if (browser) {
      logger.info(`🧹 [Puppeteer] Closing browser for "${gameName}"`)
      await browser.close()
    }
  }
}
