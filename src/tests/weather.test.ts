import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../index'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

describe('Weather Route', () => {
  let token = ''

  beforeAll(async () => {
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    })
  
    if (testUser) {
      await prisma.weatherQuery.deleteMany({
        where: { userId: testUser.id },
      })
      await prisma.user.delete({ where: { id: testUser.id } })
    }
  
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'USER',
      },
    })
  
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password',
    })
  
    token = res.body.token
  })
  
  afterAll(async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    })
  
    if (user) {
      await prisma.weatherQuery.deleteMany({ where: { userId: user.id } })
      await prisma.user.delete({ where: { id: user.id } })
    }
  
    await prisma.$disconnect()
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
