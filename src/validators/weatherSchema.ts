import { z } from 'zod'

export const WeatherQuerySchema = z.object({
  city: z.string().min(2),
  country: z.string().length(2),
})
