import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { chromium } from 'playwright'
import logger from './logger.service'

const CHROMIUM_PATH = '/opt/render/.cache/ms-playwright/chromium'

async function ensurePlaywrightInstalled() {
  if (fs.existsSync(CHROMIUM_PATH)) {
    logger.info('✅ [Playwright] Chromium already installed, skipping installation.')
    return
  }

  try {
    logger.info('⬇️ [Playwright] Chromium not found. Installing...')
    execSync('npx playwright install', { stdio: 'inherit' })
    logger.info('✅ [Playwright] Installation complete.')
  } catch (err: any) {
    logger.error('❌ [Playwright] Failed to install browser:', { message: err.message })
    throw err
  }
}

export async function fetchPhilibertImageWithPlaywright(gameName: string): Promise<string | null> {
  await ensurePlaywrightInstalled()

  const searchUrl = `https://www.philibertnet.com/en/search?search_query=${encodeURIComponent(gameName)}`
  logger.info(`🎯 [Playwright] Starting image scrape for "${gameName}"`)

  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })

    const firstProductLink = await page.getAttribute('.product_img_link', 'href')
    if (!firstProductLink) {
      logger.warn(`⚠️ No product link found for "${gameName}"`)
      return null
    }

    const productUrl = firstProductLink.startsWith('http')
      ? firstProductLink
      : `https://www.philibertnet.com${firstProductLink}`

    logger.info(`🔗 Navigating to product page: ${productUrl}`)
    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })

    const imageUrl = await page.getAttribute('#bigpic', 'src')
    if (imageUrl) {
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`
      logger.info(`✅ [Playwright] Found image: ${fullUrl}`)
      return fullUrl
    } else {
      logger.warn(`⚠️ No image found for "${gameName}"`)
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
