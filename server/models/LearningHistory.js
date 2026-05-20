import mongoose from 'mongoose'

const learningHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flashcard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flashcard',
      required: true,
    },
    deck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck',
      default: null,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      default: 'revealed_answer',
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

learningHistorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    return returnedObject
  },
})

const LearningHistory = mongoose.model('LearningHistory', learningHistorySchema)

export default LearningHistory
