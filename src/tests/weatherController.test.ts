
import request from 'supertest'
import app from '../index'
import jwt from 'jsonwebtoken'
import * as weatherService from '../services/weatherService'

const userToken = jwt.sign({ id: 'fake-user', role: 'USER' }, process.env.JWT_SECRET!)

describe('Weather Controller', () => {
  it('should return 400 if schema validation fails', async () => {
    const res = await request(app)
      .post('/api/weather')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
  
    expect(res.status).toBe(400)
    expect(res.body.message).toBeDefined()
  })

  it('should handle external API failure gracefully', async () => {
    jest.spyOn(weatherService, 'getWeatherData').mockRejectedValue(new Error('API error'))

    const res = await request(app)
      .post('/api/weather')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ city: 'Istanbul', country: 'TR' })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Weather API error')
  })
})
