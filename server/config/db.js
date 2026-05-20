import mongoose from 'mongoose'

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    console.error('MONGODB_URI is missing. Add your MongoDB Atlas connection string to server/.env.')
    process.exit(1)
  }

  try {
    await mongoose.connect(mongoUri)
    console.log('MongoDB Atlas connected')
  } catch (error) {
    console.error('MongoDB Atlas connection failed:', error.message)
    process.exit(1)
  }
}

export default connectToDatabase
