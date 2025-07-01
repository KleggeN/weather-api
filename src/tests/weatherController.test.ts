
import request from 'supertest'
import app from '../index'
import jwt from 'jsonwebtoken'

const userToken = jwt.sign({ id: 'fake-user', role: 'USER' }, process.env.JWT_SECRET!)

describe('Weather Controller', () => {
  it('should return 400 if city or country is missing', async () => {
    const res = await request(app)
      .post('/weather')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ city: 'Istanbul' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('city and country required')
  })

  it('should handle external API failure gracefully', async () => {
    jest.mock('../services/weatherService', () => ({
      getWeatherData: jest.fn().mockRejectedValue(new Error('API error')),
    }))

    const res = await request(app)
      .post('/weather')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ city: 'Istanbul', country: 'TR' })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Weather API error')
  })
})
