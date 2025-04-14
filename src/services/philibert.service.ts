import axios from 'axios'

export async function getPhilibertImageUrl(gameName: string): Promise<string | null> {
  const url = `https://philibert-scraper-crimson-firefly-6600.fly.dev/scrape?name=${encodeURIComponent(gameName)}`
  console.log(`🌐 Sending request to Fly scraper for "${gameName}" → ${url}`)

  try {
    const res = await axios.get(url, { timeout: 10000 })

    if (res.data && res.data.imageUrl) {
      console.log(`✅ Fly scraper returned image URL for "${gameName}": ${res.data.imageUrl}`)
      return res.data.imageUrl
    } else {
      console.warn(`⚠️ No imageUrl returned for "${gameName}". Response:`, res.data)
      return null
    }
  } catch (err: any) {
    console.error(`❌ Error fetching Philibert image for "${gameName}":`)
    if (err.response) {
      console.error(`↪️ Status: ${err.response.status}`)
      console.error(`↪️ Response:`, err.response.data)
    } else if (err.request) {
      console.error(`⛔ No response received. Possible timeout or network error.`)
    } else {
      console.error(`❓ Unexpected error:`, err.message || err)
    }
    return null
  }
}
