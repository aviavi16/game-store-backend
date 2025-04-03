import { Request, Response, NextFunction } from 'express'
import loggerService from '../services/logger.service'

export function crudLogger(req: Request, res: Response, next: NextFunction) {
  const method = req.method
  const path = req.originalUrl

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    loggerService.info(`🔁 ${method} ${path} → CRUD action triggered`)
  }

  next()
}
