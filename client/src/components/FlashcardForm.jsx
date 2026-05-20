import { useState } from 'react'

function FlashcardForm({ onAddFlashcard, isSubmitting = false }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const isFormValid = question.trim() !== '' && answer.trim() !== ''

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    const wasAdded = await onAddFlashcard({
      question: question.trim(),
      answer: answer.trim(),
    })

    if (wasAdded) {
      // Clear the inputs only after the backend saves the flashcard.
      setQuestion('')
      setAnswer('')
    }
  }

  return (
    <section className="flashcard-form">
      <h2>Add New Flashcard</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="question">
            Question
          </label>
          <br />
          <input
            id="question"
            className="form-input"
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="answer">
            Answer
          </label>
          <br />
          <input
            id="answer"
            className="form-input"
            type="text"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <button className="primary-button" type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Flashcard'}
        </button>
      </form>
    </section>
  )
}

export default FlashcardForm
