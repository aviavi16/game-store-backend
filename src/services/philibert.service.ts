import axios from 'axios'

export async function getPhilibertImageUrl(gameName: string): Promise<string | null> {
  const base = 'https://philibert-scraper-crimson-firefly-6600.fly.dev'
  const url = `${base}/scrape?name=${encodeURIComponent(gameName)}`

  console.log(`🌐 Sending request to Fly scraper for "${gameName}" → ${url}`)

  try {
    // 🌞 שלב 1: פינג להתעוררות
    console.log(`🌞 Sending wake-up ping to Fly scraper...`)
    await axios.get(`${base}/ping`, { timeout: 5000 })
    console.log(`✅ Ping successful! Waiting for machine to warm up...`)
    await new Promise(resolve => setTimeout(resolve, 1500)) // 1.5 שניות להבטיח מוכנות

    // 🧠 שלב 2: קריאה אמיתית
    const res = await axios.get(url, { timeout: 20000 })

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
