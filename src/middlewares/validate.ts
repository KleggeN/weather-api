import { RequestHandler } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req, res, next): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      })
      return
    }

    req.body = result.data
    next()
  }
}
