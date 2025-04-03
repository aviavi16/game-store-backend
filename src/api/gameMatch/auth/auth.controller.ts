import { Request, Response } from 'express'
import { registerUser, loginUser, createGuestUser } from './auth.service'
import { generateToken } from '../../../services/jwt.service'
import loggerService from '../../../services/logger.service'

export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body)
    const token = generateToken({ _id: user._id, username: user.username })

    loggerService.info(`✅ Registered new user: ${user.username}`)
    res.json({ user, token }) // ✅ מבנה נכון
  } catch (err) {
    loggerService.error('❌ Registration failed', err)
    res.status(500).json({ error: 'Registration failed' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user = await loginUser(email, password)
    const token = generateToken({ _id: user._id, username: user.username })

    loggerService.info(`✅ User logged in: ${user.username}`)
    res.json({ user, token }) // ✅ מבנה נכון
  } catch (err) {
    loggerService.error('❌ Login failed', err)
    res.status(401).json({ error: 'Login failed' })
  }
}

export async function guestLogin(req: Request, res: Response) {
  try {
    const user = await createGuestUser()
    const token = generateToken({ _id: user._id, username: user.username })

    loggerService.info(`✅ Guest user created: ${user.username}`)
    res.json({ user, token }) // ✅ מבנה נכון
  } catch (err) {
    loggerService.error('❌ Guest login failed', err)
    res.status(500).json({ error: 'Guest login failed' })
  }
}
