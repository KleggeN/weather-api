import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import weatherRoutes from './routes/weatherRoutes'
import adminRoutes from './routes/adminRoutes'
import { connectRedis } from './config/redis'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.get('/health', (_req, res) => {
  res.send('Weather API is running')
})
connectRedis()

app.use('/api/auth', authRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/admin', adminRoutes)

export default app