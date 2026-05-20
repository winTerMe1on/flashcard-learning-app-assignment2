import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import connectToDatabase from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import deckRoutes from './routes/deckRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import historyRoutes from './routes/historyRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.json({ message: 'Flashcard API is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/decks', deckRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/history', historyRoutes)

const startServer = async () => {
  await connectToDatabase()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
