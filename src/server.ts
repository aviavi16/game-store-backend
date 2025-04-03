import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

import loggerService from './services/logger.service'
import { connectToDb } from './services/db.service'
import { gameRoutes } from './api/game/game.routes'
import { gameMatchRoutes } from './api/gameMatch/gameMatch.routes'
import { requestLogger } from './middlewares/requestLogger'
import { crudLogger } from './middlewares/crudLogger'

export const app = express()

// CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://game-store-front.onrender.com',
  ],
  credentials: true,
}

// MIDDLEWARES
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(requestLogger)
app.use(crudLogger)
app.use(express.static('public'))

// ROUTES
app.use('/api/game', gameRoutes)
app.use('/api/game-match', gameMatchRoutes)

// CATCH-ALL (Frontend support)
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'))
})

// START SERVER
const PORT = process.env.PORT || 3030

async function startServer() {
  try {
    await connectToDb()
    app.listen(PORT, () => {
      loggerService.info(`🚀 Server is running on http://localhost:${PORT}`)
    })
  } catch (err) {
    loggerService.error('❌ Failed to start server:', err)
  }
}

startServer()
