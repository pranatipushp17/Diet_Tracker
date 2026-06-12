const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const foodRoutes = require('./routes/foodRoutes')
const mealRoutes = require('./routes/mealRoutes')
const dailyRoutes = require('./routes/dailyRoutes')
const aiRoutes = require('./routes/aiRoutes')


dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/meals', mealRoutes)
app.use('/api/daily', dailyRoutes)
app.use('/api/ai', aiRoutes)


app.get('/', (req, res) => res.send('NutriTrack API running!'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))