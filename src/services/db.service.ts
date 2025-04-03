import { MongoClient, Db } from 'mongodb'
import { config } from '../config/config'
import loggerService from './logger.service'

let dbConn: Db | null = null
let client: MongoClient | null = null

export async function connectToDb(): Promise<void> {
  if (dbConn) return

  try {
    client = await MongoClient.connect(config.dbURL)
    dbConn = client.db(config.dbName)
    loggerService.info('✅ Connected to MongoDB:', config.dbName)
  } catch (err) {
    loggerService.error('❌ Cannot connect to DB', err)
    throw err
  }
}

export async function getCollection(collectionName: string) {
  if (!dbConn) throw new Error('DB not connected. Call connectToDb() first.')

  const collection = dbConn.collection(collectionName)

  // לוגים על פעולות CRUD בלבד
  const originalInsertOne = collection.insertOne.bind(collection)
  const originalUpdateOne = collection.updateOne.bind(collection)
  const originalDeleteOne = collection.deleteOne.bind(collection)

  collection.insertOne = async function (...args) {
    loggerService.info(`🟢 insertOne → "${collectionName}"`, args[0])
    return originalInsertOne(...args)
  }

  collection.updateOne = async function (...args) {
    loggerService.info(`🟡 updateOne → "${collectionName}"`, args[0])
    return originalUpdateOne(...args)
  }

  collection.deleteOne = async function (...args) {
    loggerService.info(`🔴 deleteOne → "${collectionName}"`, args[0])
    return originalDeleteOne(...args)
  }

  loggerService.info(`📦 Accessing collection: "${collectionName}"`)
  return collection
}


export async function closeDbConnection(): Promise<void> {
  try {
    if (client) {
      await client.close()
      dbConn = null
      client = null
      loggerService.info('🛑 MongoDB connection closed')
    }
  } catch (err) {
    loggerService.error('❌ Failed to close MongoDB connection', err)
  }
}
