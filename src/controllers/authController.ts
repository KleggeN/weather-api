import { Request, Response, RequestHandler } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const register: RequestHandler = async (req, res) => {
  try {
  const { email, password, role } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ message: 'User already exists' })
    return
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: role || 'USER',
    },
  })

  res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } })
} catch (err) {
  console.error('Register error:', err)
  res.status(500).json({ message: 'Internal server error' })
}
}

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  })

  res.status(200).json({ token })
}
