import express from 'express'
import mongoose from 'mongoose'
import { protect } from '../middleware/authMiddleware.js'
import Deck from '../models/Deck.js'

const router = express.Router()

router.use(protect)

function isAdmin(request) {
  return request.user.role === 'admin'
}

function hasValidDeckId(deckId) {
  return mongoose.Types.ObjectId.isValid(deckId)
}

function getOwnerFilter(request) {
  return isAdmin(request) ? {} : { owner: request.user._id }
}

function getDeckFields(body) {
  return {
    title: body.title?.trim(),
    description: body.description?.trim() || '',
  }
}

router.get('/', async (request, response) => {
  try {
    const decks = await Deck.find(getOwnerFilter(request)).sort({ createdAt: -1 })
    response.json(decks)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load decks.' })
  }
})

router.post('/', async (request, response) => {
  const { title, description } = getDeckFields(request.body)

  if (!title) {
    return response.status(400).json({ message: 'Title is required.' })
  }

  try {
    const deck = await Deck.create({
      title,
      description,
      owner: request.user._id,
    })

    response.status(201).json(deck)
  } catch (error) {
    response.status(500).json({ message: 'Unable to create deck.' })
  }
})

router.get('/:id', async (request, response) => {
  if (!hasValidDeckId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid deck id.' })
  }

  try {
    const deck = await Deck.findOne({
      _id: request.params.id,
      ...getOwnerFilter(request),
    })

    if (!deck) {
      return response.status(404).json({ message: 'Deck not found.' })
    }

    response.json(deck)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load deck.' })
  }
})

router.put('/:id', async (request, response) => {
  if (!hasValidDeckId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid deck id.' })
  }

  const { title, description } = getDeckFields(request.body)

  if (!title) {
    return response.status(400).json({ message: 'Title is required.' })
  }

  try {
    const deck = await Deck.findOneAndUpdate(
      {
        _id: request.params.id,
        ...getOwnerFilter(request),
      },
      { title, description },
      { new: true, runValidators: true },
    )

    if (!deck) {
      return response.status(404).json({ message: 'Deck not found.' })
    }

    response.json(deck)
  } catch (error) {
    response.status(500).json({ message: 'Unable to update deck.' })
  }
})

router.delete('/:id', async (request, response) => {
  if (!hasValidDeckId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid deck id.' })
  }

  try {
    const deck = await Deck.findOneAndDelete({
      _id: request.params.id,
      ...getOwnerFilter(request),
    })

    if (!deck) {
      return response.status(404).json({ message: 'Deck not found.' })
    }

    response.json({ message: 'Deck deleted.' })
  } catch (error) {
    response.status(500).json({ message: 'Unable to delete deck.' })
  }
})

export default router
