import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/jwt.service'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Missing token' })
    return
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    res.status(403).json({ error: 'Invalid token' })
    return
  }

  req.user = decoded
  next()
}
