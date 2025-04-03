import { Request, Response, NextFunction } from 'express'
import loggerService from '../services/logger.service'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime
    const status = res.statusCode
    loggerService.info(`📡 ${method} ${originalUrl} → ${status} (${duration}ms)`)
  })

  next()
}
