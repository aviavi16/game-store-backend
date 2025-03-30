import { MongoClient, Db } from 'mongodb'
import { config } from '../config/config'
import { logger } from './logger.service'

let dbConn: Db | null = null

export async function connectToDb(): Promise<void> {
  if (dbConn) return

  try {
    const client = await MongoClient.connect(config.dbURL)
    dbConn = client.db(config.dbName)
    logger.info('✅ Connected to MongoDB:', config.dbName)
  } catch (err) {
    logger.error('❌ Cannot connect to DB', err)
    throw err
  }
}

export async function getCollection(collectionName: string) {
  if (!dbConn) throw new Error('DB not connected. Call connectToDb() first.')
  return dbConn.collection(collectionName)
}
