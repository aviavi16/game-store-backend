import axios from 'axios'

export async function getPhilibertImageUrl(gameName: string): Promise<string | null> {
  try {
    const res = await axios.get(`https://philibert-scraper-crimson-firefly-6600.fly.dev/scrape?name=${encodeURIComponent(gameName)}`, {
      timeout: 10000,
    })

    if (res.data && res.data.imageUrl) {
      return res.data.imageUrl
    } else {
      console.warn(`⚠️ No imageUrl returned for "${gameName}"`)
      return null
    }
  } catch (err) {
    console.error(`❌ Failed to fetch Philibert image for "${gameName}":`, err instanceof Error ? err.message : err)
    return null
  }
}
