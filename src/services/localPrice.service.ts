import fetch from 'node-fetch'
import loggerService from './logger.service' // Adjust path to your logger

export type StoreResult = {
  name: string
  address: string
  location: { lat: number; lng: number }
  website?: string
}

let dynamicStoreCache: StoreResult[] | null = null

export async function findNearbyGameStores(
  userLocation: { lat: number; lng: number }
): Promise<StoreResult[]> {
  if (dynamicStoreCache) {
    loggerService.info(`📦 Returning cached store list`)
    return dynamicStoreCache
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    loggerService.error('❌ GOOGLE_MAPS_API_KEY is missing in environment variables.')
    throw new Error('Missing Google Maps API key')
  }

  const radius = 10000
  const type = 'store'
  const keyword = 'board games'

  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=${radius}&type=${type}&keyword=${encodeURIComponent(
    keyword
  )}&key=${apiKey}`

  loggerService.info(`📍 Searching Google Maps for board game stores near (${userLocation.lat}, ${userLocation.lng})`)

  let response
  try {
    response = await fetch(endpoint)
  } catch (err) {
    loggerService.error('❌ Failed to fetch from Google Maps NearbySearch API', err)
    return []
  }

  const data = await response.json()

  if (!data.results || !Array.isArray(data.results)) {
    loggerService.error('❌ Invalid response from Google Maps API', data)
    return []
  }

  const stores: StoreResult[] = []

  for (const place of data.results) {
    const { name, vicinity, geometry, place_id } = place

    if (!geometry?.location) {
      loggerService.warn(`⚠️ Skipping store "${name}" — missing location info`)
      continue
    }

    let website: string | undefined = undefined

    if (place_id) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,website&key=${apiKey}`
      try {
        const detailsRes = await fetch(detailsUrl)
        const detailsData = await detailsRes.json()

        if (detailsData.result?.website) {
          website = detailsData.result.website
          loggerService.info(`🌐 Found website for "${name}": ${website}`)
        } else {
          loggerService.warn(`⚠️ No website found for "${name}" via Place Details API`)
        }
      } catch (err) {
        loggerService.error(`❌ Failed to fetch details for store "${name}"`, err)
      }
    }

    stores.push({
      name,
      address: vicinity,
      location: {
        lat: geometry.location.lat,
        lng: geometry.location.lng,
      },
      website,
    })
  }

  loggerService.info(`✅ Found ${stores.length} game-related stores near user`)

  dynamicStoreCache = stores
  return stores
}
