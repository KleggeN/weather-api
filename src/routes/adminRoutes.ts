import { Router } from 'express'
import { getAllUsers, createUser } from '../controllers/adminController'
import { authenticate, authorizeRole } from '../middlewares/auth'

const router = Router()

router.use(authenticate)
router.use(authorizeRole('ADMIN'))

router.get('/users', getAllUsers)
router.post('/users', createUser)

export default router
