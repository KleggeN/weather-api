
import request from 'supertest'
import app from '../index'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

beforeAll(async () => {
  const user = await prisma.user.findUnique({
    where: { email: 'testuser@example.com' },
  })

  if (user) {
    await prisma.weatherQuery.deleteMany({ where: { userId: user.id } })
    await prisma.user.delete({ where: { id: user.id } })
  }

  await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      password: await bcrypt.hash('123456', 10),
      role: 'USER',
    },
  })
})

afterAll(async () => {
  const user = await prisma.user.findUnique({
    where: { email: 'testuser@example.com' },
  })

  if (user) {
    await prisma.weatherQuery.deleteMany({ where: { userId: user.id } })
    await prisma.user.delete({ where: { id: user.id } })
  }

  await prisma.$disconnect()
})

describe('POST /auth/register', () => {
  it('should return 409 if user already exists', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'testuser@example.com',
      password: 'password123',
      role: 'USER'
    })

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('User already exists')
  })
})

describe('POST /auth/login', () => {
  it('should return 404 for nonexistent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'doesnotexist@example.com',
      password: 'password',
    })

    expect(res.status).toBe(404)
  })

  it('should return 401 for invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'wrongpassword',
    })

    expect(res.status).toBe(401)
  })
})
