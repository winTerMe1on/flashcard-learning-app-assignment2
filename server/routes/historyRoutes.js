import express from 'express'
import mongoose from 'mongoose'
import { adminOnly, protect } from '../middleware/authMiddleware.js'
import Flashcard from '../models/Flashcard.js'
import LearningHistory from '../models/LearningHistory.js'

const router = express.Router()

router.use(protect)

function isAdmin(request) {
  return request.user.role === 'admin'
}

function hasValidFlashcardId(flashcardId) {
  return mongoose.Types.ObjectId.isValid(flashcardId)
}

function getFlashcardFilter(request, flashcardId) {
  return {
    _id: flashcardId,
    ...(isAdmin(request) ? {} : { owner: request.user._id }),
  }
}

function populateHistory(query) {
  return query
    .populate('user', 'name email role')
    .populate('flashcard', 'question answer difficulty')
    .populate('deck', 'title description')
}

router.post('/', async (request, response) => {
  const flashcardId = request.body.flashcard || request.body.flashcardId
  const action = request.body.action?.trim() || 'revealed_answer'

  if (!flashcardId || !action) {
    return response.status(400).json({ message: 'Flashcard and action are required.' })
  }

  if (!hasValidFlashcardId(flashcardId)) {
    return response.status(400).json({ message: 'Invalid flashcard id.' })
  }

  try {
    const flashcard = await Flashcard.findOne(getFlashcardFilter(request, flashcardId))

    if (!flashcard) {
      return response.status(404).json({ message: 'Flashcard not found.' })
    }

    const history = await LearningHistory.create({
      user: request.user._id,
      flashcard: flashcard._id,
      deck: flashcard.deck || null,
      action,
      viewedAt: new Date(),
    })

    const populatedHistory = await populateHistory(
      LearningHistory.findById(history._id),
    )

    response.status(201).json(populatedHistory)
  } catch (error) {
    response.status(500).json({ message: 'Unable to record learning history.' })
  }
})

router.get('/me', async (request, response) => {
  try {
    const history = await populateHistory(
      LearningHistory.find({ user: request.user._id }).sort({ viewedAt: -1 }),
    )

    response.json(history)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load learning history.' })
  }
})

router.get('/admin', adminOnly, async (request, response) => {
  try {
    const history = await populateHistory(
      LearningHistory.find().sort({ viewedAt: -1 }),
    )

    response.json(history)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load all learning history.' })
  }
})

export default router
