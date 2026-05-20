import express from 'express'
import jwt from 'jsonwebtoken'
import { protect } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

const router = express.Router()

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing.')
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function getUserResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

router.post('/register', async (request, response) => {
  const name = request.body.name?.trim()
  const email = request.body.email?.trim().toLowerCase()
  const password = request.body.password
  const role = request.body.role?.trim().toLowerCase() || 'user'

  if (!name || !email || !password) {
    return response.status(400).json({ message: 'Name, email, and password are required.' })
  }

  if (!['user', 'admin'].includes(role)) {
    return response.status(400).json({ message: 'Role must be either user or admin.' })
  }

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return response.status(409).json({ message: 'Email is already registered.' })
    }

    const user = await User.create({ name, email, password, role })

    return response.status(201).json({
      user: getUserResponse(user),
      token: createToken(user._id),
    })
  } catch (error) {
    console.error('Register error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
      errors: error.errors,
      stack: error.stack,
    })

    if (error.name === 'ValidationError') {
      return response.status(400).json({ message: error.message })
    }

    if (error.code === 11000) {
      return response.status(409).json({ message: 'Email is already registered.' })
    }

    if (error.message === 'JWT_SECRET is missing.') {
      return response.status(500).json({ message: 'JWT_SECRET is not configured.' })
    }

    return response.status(500).json({ message: 'Unable to register user.' })
  }
})

router.post('/login', async (request, response) => {
  const email = request.body.email?.trim().toLowerCase()
  const password = request.body.password

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required.' })
  }

  try {
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    return response.json({
      user: getUserResponse(user),
      token: createToken(user._id),
    })
  } catch (error) {
    if (error.message === 'JWT_SECRET is missing.') {
      return response.status(500).json({ message: 'JWT_SECRET is not configured.' })
    }

    return response.status(500).json({ message: 'Unable to log in.' })
  }
})

router.get('/me', protect, (request, response) => {
  response.json({ user: request.user })
})

export default router
