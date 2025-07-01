import request from 'supertest'
import app from '../index'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

describe('Admin Routes', () => {
  let adminToken = ''

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await bcrypt.hash('adminpassword', 10),
        role: 'ADMIN',
      },
    })
    const login = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'adminpassword',
    })
    adminToken = login.body.token
  })

  it('should list all users', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'createdbyadmin@example.com',
        password: 'pass1234',
        role: 'USER',
      })

    expect(res.status).toBe(201)
  })

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: ['createdbyadmin@example.com','admin@example.com'] },
      },
    })
    await prisma.$disconnect()
  })
})
