import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../server' // ודא שאתה מייצא את app מ־server.ts
import { connectToDb, closeDbConnection } from '../services/db.service'

const testEmail = `test_${Date.now()}@email.com`

beforeAll(async () => {
  await connectToDb()
})

afterAll(async () => {
  await closeDbConnection()
})

describe('🛡️ Auth API Tests', () => {
  it('🔐 should register a new user', async () => {
    const res = await request(app)
      .post('/api/game-match/auth/register')
      .send({
        username: 'test_user',
        email: testEmail,
        password: '123456',
        bggUsername: 'test_bgg_user',
      })

    expect(res.status).toBe(200)
    expect(res.body.user.username).toBe('test_user')
    expect(res.body.user.email).toBe(testEmail)
    expect(res.body.token).toBeDefined()
  })

  it('🔑 should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/game-match/auth/login')
      .send({
        email: testEmail,
        password: '123456',
      })

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(testEmail)
    expect(res.body.token).toBeDefined()
  })

  it('👤 should login as guest user', async () => {
    const res = await request(app)
      .post('/api/game-match/auth/guest')

    expect(res.status).toBe(200)
    expect(res.body.user.username).toMatch(/^guest_/)
    expect(res.body.user.isGuest).toBe(true)
    expect(res.body.user._id).toBeDefined()
  })
})

describe('🧪 Protected Route Access', () => {
    let token: string
  
    it('🔐 should allow access with valid JWT', async () => {
      // Login to get a token
      const loginRes = await request(app)
        .post('/api/game-match/auth/login')
        .send({
          email: testEmail,
          password: '123456',
        })
  
      token = loginRes.body.token
      expect(token).toBeDefined()
  
      const res = await request(app)
        .get('/api/game-match/secure-test')
        .set('Authorization', `Bearer ${token}`)
  
      expect(res.status).toBe(200)
      expect(res.body.msg).toMatch(/Welcome/)
      expect(res.body.userId).toBeDefined()
    })
  
    it('🚫 should reject request without token', async () => {
      const res = await request(app)
        .get('/api/game-match/secure-test')
  
      expect(res.status).toBe(401)
      expect(res.body.error).toBe('Missing token')
    })
  
    it('🚫 should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/game-match/secure-test')
        .set('Authorization', 'Bearer not.a.valid.token')
  
      expect(res.status).toBe(403)
      expect(res.body.error).toBe('Invalid token')
    })
  })