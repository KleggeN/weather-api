
import request from 'supertest'
import app from '../index'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.user.create({
    data: {
      email: 'exists@example.com',
      password: await bcrypt.hash('validpassword', 10),
      role: 'USER',
    },
  })
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('POST /auth/register', () => {
  it('should return 409 if user already exists', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'exists@example.com',
      password: 'password123',
    })

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('User already exists')
  })
})

describe('POST /auth/login', () => {
  it('should return 404 for nonexistent user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'doesnotexist@example.com',
      password: 'password',
    })

    expect(res.status).toBe(404)
  })

  it('should return 401 for invalid password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'exists@example.com',
      password: 'wrongpassword',
    })

    expect(res.status).toBe(401)
  })
})
