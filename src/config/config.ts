import dotenv from 'dotenv'
dotenv.config()

export const config = {
  dbURL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'BoardGamesDB',
  openaiApiKey: process.env.OPENAI_API_KEY || 'undefined',
  unsplashApiKey: process.env.UNSPLASH_API_KEY || 'undefined',
  googleApiKey: process.env.GOOGLE_API_KEY || 'undefined',
  googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || 'undefined',
}