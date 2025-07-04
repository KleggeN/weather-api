import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'ADMIN']),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
