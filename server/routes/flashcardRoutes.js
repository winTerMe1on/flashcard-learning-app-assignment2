import express from 'express'
import mongoose from 'mongoose'
import { protect } from '../middleware/authMiddleware.js'
import Deck from '../models/Deck.js'
import Flashcard from '../models/Flashcard.js'

const router = express.Router()

router.use(protect)

function isAdmin(request) {
  return request.user.role === 'admin'
}

function hasValidFlashcardId(flashcardId) {
  return mongoose.Types.ObjectId.isValid(flashcardId)
}

function hasValidDeckId(deckId) {
  return mongoose.Types.ObjectId.isValid(deckId)
}

function getOwnerFilter(request) {
  return isAdmin(request) ? {} : { owner: request.user._id }
}

function getFlashcardFields(body) {
  return {
    question: body.question?.trim(),
    answer: body.answer?.trim(),
    deck: body.deck,
    difficulty: body.difficulty || 'medium',
  }
}

router.get('/', async (request, response) => {
  try {
    const filter = {
      ...getOwnerFilter(request),
    }

    if (request.query.deck) {
      if (!hasValidDeckId(request.query.deck)) {
        return response.status(400).json({ message: 'Invalid deck id.' })
      }

      filter.deck = request.query.deck
    }

    const flashcards = await Flashcard.find(filter).sort({ createdAt: -1 })
    response.json(flashcards)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load flashcards.' })
  }
})

router.get('/:id', async (request, response) => {
  if (!hasValidFlashcardId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid flashcard id.' })
  }

  try {
    const flashcard = await Flashcard.findOne({
      _id: request.params.id,
      ...getOwnerFilter(request),
    })

    if (!flashcard) {
      return response.status(404).json({ message: 'Flashcard not found.' })
    }

    response.json(flashcard)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load the flashcard.' })
  }
})

router.post('/', async (request, response) => {
  const { question, answer, deck, difficulty } = getFlashcardFields(request.body)

  if (!question || !answer || !deck) {
    return response.status(400).json({ message: 'Question, answer, and deck are required.' })
  }

  if (!hasValidDeckId(deck)) {
    return response.status(400).json({ message: 'Invalid deck id.' })
  }

  try {
    const existingDeck = await Deck.findOne({
      _id: deck,
      ...getOwnerFilter(request),
    })

    if (!existingDeck) {
      return response.status(404).json({ message: 'Deck not found.' })
    }

    const newFlashcard = await Flashcard.create({
      question,
      answer,
      deck,
      difficulty,
      owner: existingDeck.owner,
    })

    response.status(201).json(newFlashcard)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ message: error.message })
    }

    response.status(500).json({ message: 'Unable to create the flashcard.' })
  }
})

router.put('/:id', async (request, response) => {
  if (!hasValidFlashcardId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid flashcard id.' })
  }

  const { question, answer, deck, difficulty } = getFlashcardFields(request.body)

  if (!question || !answer) {
    return response.status(400).json({ message: 'Question and answer are required.' })
  }

  if (deck && !hasValidDeckId(deck)) {
    return response.status(400).json({ message: 'Invalid deck id.' })
  }

  try {
    const updateFields = { question, answer, difficulty }

    if (deck) {
      const existingDeck = await Deck.findOne({
        _id: deck,
        ...getOwnerFilter(request),
      })

      if (!existingDeck) {
        return response.status(404).json({ message: 'Deck not found.' })
      }

      updateFields.deck = deck
      updateFields.owner = existingDeck.owner
    }

    const updatedFlashcard = await Flashcard.findOneAndUpdate(
      {
        _id: request.params.id,
        ...getOwnerFilter(request),
      },
      updateFields,
      { new: true, runValidators: true },
    )

    if (!updatedFlashcard) {
      return response.status(404).json({ message: 'Flashcard not found.' })
    }

    response.json(updatedFlashcard)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ message: error.message })
    }

    response.status(500).json({ message: 'Unable to update the flashcard.' })
  }
})

router.delete('/:id', async (request, response) => {
  if (!hasValidFlashcardId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid flashcard id.' })
  }

  try {
    const deletedFlashcard = await Flashcard.findOneAndDelete({
      _id: request.params.id,
      ...getOwnerFilter(request),
    })

    if (!deletedFlashcard) {
      return response.status(404).json({ message: 'Flashcard not found.' })
    }

    response.json({ message: 'Flashcard deleted.' })
  } catch (error) {
    response.status(500).json({ message: 'Unable to delete the flashcard.' })
  }
})

export default router
