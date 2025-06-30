import axios from 'axios'
import { redis } from '../config/redis'

export async function getWeatherData(city: string, country: string) {
  const key = `${city.toLowerCase()}-${country.toLowerCase()}`
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const apiKey = process.env.OPENWEATHER_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`

  const response = await axios.get(url)
  const data = response.data

  await redis.set(key, JSON.stringify(data), { EX: 60 * 60 })
  return data
}
