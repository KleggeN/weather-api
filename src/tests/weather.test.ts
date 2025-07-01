import request from 'supertest'
import app from '../index'

describe('Weather Route', () => {
  let token = ''

  beforeAll(async () => {
    const login = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'admin123',
    })
    token = login.body.token
  })

  it('should return weather data for a city', async () => {
    const res = await request(app)
      .post('/api/weather')
      .set('Authorization', `Bearer ${token}`)
      .send({ city: 'Istanbul', country: 'TR' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Istanbul')
  })
})
