import request from 'supertest'
import app from '../index'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

describe('Auth Routes', () => {
  const email = 'testuser@example.com'
  const password = '123456'

  beforeAll(async () => {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      await prisma.weatherQuery.deleteMany({ where: { userId: existing.id } })
      await prisma.user.delete({ where: { id: existing.id } })
    }
  })

  afterAll(async () => {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      await prisma.weatherQuery.deleteMany({ where: { userId: existing.id } })
      await prisma.user.delete({ where: { id: existing.id } })
    }
    await prisma.$disconnect()
  })

  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email,
      password,
      role: 'USER',
    })

    expect(res.status).toBe(201)
  })

  it('should login a user and return token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email,
      password,
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })
})
