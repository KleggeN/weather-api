import { Router } from 'express'
import { fetchWeather, getQueries } from '../controllers/weatherController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/', authenticate, fetchWeather)
router.get('/', authenticate, getQueries)

export default router
