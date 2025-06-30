import { Request, Response } from 'express'
import { getWeatherData } from '../services/weatherService'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middlewares/auth'

const prisma = new PrismaClient()

export const fetchWeather = async (req: AuthRequest, res: Response) => {
  const { city, country } = req.body
  if (!city || !country) return res.status(400).json({ message: 'city and country required' })

  try {
    const data = await getWeatherData(city, country)

    await prisma.weatherQuery.create({
      data: {
        city,
        country,
        response: data,
        userId: req.user!.id,
      },
    })

    res.json(data)
  } catch (err) {
    res.status(500).json({ message: 'Weather API error', error: err })
  }
}

export const getQueries = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user?.role === 'ADMIN'
  const where = isAdmin ? {} : { userId: req.user!.id }

  const queries = await prisma.weatherQuery.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  res.json(queries)
}
