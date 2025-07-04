import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true }
  })
  res.json(users)
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    res.status(400).json({ message: 'email, password, role required' })
    return
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    res.status(409).json({ message: 'Email already exists' })
    return
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hashed, role },
  })

  res.status(201).json({ id: user.id, email: user.email, role: user.role })
}

