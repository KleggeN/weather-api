
import request from 'supertest'
import app from '../index'
import jwt from 'jsonwebtoken'

describe('Auth middleware', () => {
  it('should reject request without token', async () => {
    const res = await request(app).get('/weather')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token missing')
  })

  it('should reject request with invalid token', async () => {
    const res = await request(app)
      .get('/weather')
      .set('Authorization', 'Bearer invalid.token.here')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid token')
  })

  it('should reject request with wrong role', async () => {
    const token = jwt.sign({ id: '123', role: 'USER' }, process.env.JWT_SECRET!)
    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Access denied')
  })
})
