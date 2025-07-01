import { Router } from 'express'
import { register, login } from '../controllers/authController'
import { validate } from '../middlewares/validate'
import { RegisterSchema, LoginSchema } from '../validators/authSchemas'

const router = Router()

router.post('/register', validate(RegisterSchema), register)
router.post('/login', validate(LoginSchema), login)

export default router
