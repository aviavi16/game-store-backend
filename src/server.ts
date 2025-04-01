import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import loggerService from './services/logger.service'
import { connectToDb } from './services/db.service'
import { gameRoutes } from './api/game/game.routes'
import path from 'path';


const app = express()

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

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.static('public'))

// ROUTES
app.use('/api/game', gameRoutes)

const PORT = process.env.PORT || 3030

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'))
})

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
