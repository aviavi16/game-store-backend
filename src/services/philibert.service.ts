import axios from 'axios';

export async function getPhilibertImageUrl(gameName: string): Promise<string | null> {
  const base = 'https://philibert-scraper-crimson-firefly-6600.fly.dev';
  const url = `${base}/scrape?name=${encodeURIComponent(gameName)}`;

  console.log(`🌐 Sending request to Fly scraper for "${gameName}" → ${url}`);

  const startTime = Date.now();

  try {
    const res = await axios.get(url, { timeout: 90000 }); // 🕐 90 שניות

    const elapsed = Date.now() - startTime;
    console.log(`✅ Fly scraper responded after ${elapsed}ms`);

    if (res.data && res.data.imageUrl) {
      console.log(`✅ Image received for "${gameName}": ${res.data.imageUrl}`);
      return res.data.imageUrl;
    } else {
      console.warn(`⚠️ No imageUrl returned for "${gameName}". Response:`, res.data);
      return null;
    }
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ Error fetching Philibert image for "${gameName}" after ${elapsed}ms`);

    if (err.response) {
      console.error(`↪️ Status: ${err.response.status}`);
      console.error(`↪️ Response:`, err.response.data);
    } else if (err.request) {
      console.error(`⛔ No response received. Possible timeout or network error.`);
    } else {
      console.error(`❓ Unexpected error:`, err.message || err);
    }

    return null;
  }
}
