import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import { connectRedis } from './config/redis'
import weatherRoutes from './routes/weatherRoutes'
import adminRoutes from './routes/adminRoutes'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
connectRedis()

app.use('/api/auth', authRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => res.send('Weather API is running'))
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
