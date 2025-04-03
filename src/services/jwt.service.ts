import jwt from 'jsonwebtoken'
import loggerService from './logger.service'

const TOKEN_SECRET = process.env.JWT_SECRET || 'secret-token'

export function generateToken(payload: any): string {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, TOKEN_SECRET)
  } catch (err) {
    loggerService.warn('❌ Invalid JWT token')
    return null
  }
}
