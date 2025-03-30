import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { logger } from './services/logger.service'
import { connectToDb } from './services/db.service'
import { gameRoutes } from './api/game/game.routes'


const app = express()

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.static('public'))

// ROUTES
app.use('/api/game', gameRoutes)

const PORT = process.env.PORT || 3030

async function startServer() {
  try {
    await connectToDb()
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`)
    })
  } catch (err) {
    logger.error('❌ Failed to start server:', err)
  }
}

startServer()
