import { Router } from 'express'
import { fetchWeather, getQueries } from '../controllers/weatherController'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validate'
import { WeatherQuerySchema } from '../validators/weatherSchema'

const router = Router()

router.post('/', authenticate, validate(WeatherQuerySchema), fetchWeather)
router.get('/', authenticate, getQueries)

export default router
