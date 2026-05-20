import { useEffect, useMemo, useState } from 'react'
import { getDecks } from '../services/deckApi'
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcards,
  updateFlashcard,
} from '../services/flashcardApi'
import { createHistoryRecord } from '../services/historyApi'

function getEntityId(entity) {
  return typeof entity === 'string' ? entity : entity?.id
}

function Flashcards({ selectedDeckId, onSelectDeck }) {
  const [decks, setDecks] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [revealedIds, setRevealedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingFlashcardId, setEditingFlashcardId] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    deck: selectedDeckId || '',
    difficulty: 'medium',
  })
  const [editData, setEditData] = useState({
    question: '',
    answer: '',
    deck: selectedDeckId || '',
    difficulty: 'medium',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const activeDeckId = selectedDeckId || formData.deck

  useEffect(() => {
    setFormData((current) => ({ ...current, deck: selectedDeckId || current.deck }))
  }, [selectedDeckId])

  useEffect(() => {
    const loadData = async () => {
      setErrorMessage('')
      setIsLoading(true)

      try {
        const [savedDecks, savedFlashcards] = await Promise.all([
          getDecks(),
          getFlashcards(selectedDeckId),
        ])
        setDecks(savedDecks)
        setFlashcards(savedFlashcards)

        if (!selectedDeckId && savedDecks.length > 0) {
          setFormData((current) => ({ ...current, deck: savedDecks[0].id }))
        }
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedDeckId])

  const filteredFlashcards = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return flashcards
    }

    return flashcards.filter((flashcard) =>
      `${flashcard.question} ${flashcard.answer}`.toLowerCase().includes(query),
    )
  }, [flashcards, searchTerm])

  const handleCreateFlashcard = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const createdFlashcard = await createFlashcard(formData)
      const createdDeckId = getEntityId(createdFlashcard.deck)
      if (!selectedDeckId || createdDeckId === selectedDeckId) {
        setFlashcards((current) => [createdFlashcard, ...current])
      }
      setFormData((current) => ({
        question: '',
        answer: '',
        deck: current.deck,
        difficulty: 'medium',
      }))
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReveal = async (flashcardId) => {
    const isAlreadyRevealed = revealedIds.includes(flashcardId)
    setRevealedIds((current) =>
      isAlreadyRevealed ? current.filter((id) => id !== flashcardId) : [...current, flashcardId],
    )

    if (!isAlreadyRevealed) {
      try {
        await createHistoryRecord({ flashcard: flashcardId, action: 'revealed_answer' })
      } catch (error) {
        setErrorMessage(error.message)
      }
    }
  }

  const startEditing = (flashcard) => {
    setEditingFlashcardId(flashcard.id)
    setEditData({
      question: flashcard.question,
      answer: flashcard.answer,
      deck: getEntityId(flashcard.deck),
      difficulty: flashcard.difficulty || 'medium',
    })
  }

  const handleUpdateFlashcard = async (flashcardId) => {
    setErrorMessage('')

    try {
      const updatedFlashcard = await updateFlashcard(flashcardId, editData)
      const updatedDeckId = getEntityId(updatedFlashcard.deck)
      setFlashcards((current) =>
        selectedDeckId && updatedDeckId !== selectedDeckId
          ? current.filter((flashcard) => flashcard.id !== flashcardId)
          : current.map((flashcard) => (flashcard.id === flashcardId ? updatedFlashcard : flashcard)),
      )
      setEditingFlashcardId(null)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleDeleteFlashcard = async (flashcardId) => {
    const shouldDelete = window.confirm('Delete this flashcard?')

    if (!shouldDelete) {
      return
    }

    setErrorMessage('')

    try {
      await deleteFlashcard(flashcardId)
      setFlashcards((current) => current.filter((flashcard) => flashcard.id !== flashcardId))
      setRevealedIds((current) => current.filter((id) => id !== flashcardId))
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <section className="page-grid">
      <div className="page-heading">
        <p className="eyebrow">Flashcards</p>
        <h1>Study and refine cards</h1>
        <p className="muted-text">Create cards inside decks, reveal answers, and record study activity.</p>
      </div>

      {errorMessage && <p className="status-message error-message">{errorMessage}</p>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Card Builder</p>
            <h2>Create flashcard</h2>
          </div>
          {selectedDeckId && (
            <button type="button" className="secondary-button" onClick={() => onSelectDeck(null)}>
              Clear deck filter
            </button>
          )}
        </div>

        <form className="flashcard-form-grid" onSubmit={handleCreateFlashcard}>
          <label>
            Deck
            <select
              value={formData.deck}
              onChange={(event) => {
                setFormData((current) => ({ ...current, deck: event.target.value }))
                const deck = decks.find((item) => item.id === event.target.value)
                onSelectDeck(deck || null)
              }}
              required
            >
              <option value="">Choose deck</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Difficulty
            <select
              value={formData.difficulty}
              onChange={(event) => setFormData((current) => ({ ...current, difficulty: event.target.value }))}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label>
            Question
            <input
              value={formData.question}
              onChange={(event) => setFormData((current) => ({ ...current, question: event.target.value }))}
              placeholder="What is a closure?"
              required
            />
          </label>

          <label>
            Answer
            <input
              value={formData.answer}
              onChange={(event) => setFormData((current) => ({ ...current, answer: event.target.value }))}
              placeholder="A function with access to its outer scope."
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSubmitting || !activeDeckId}>
            {isSubmitting ? 'Creating...' : 'Create flashcard'}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Study Cards</p>
            <h2>{selectedDeckId ? 'Selected deck cards' : 'All flashcards'}</h2>
          </div>
          <label className="search-field">
            Search
            <input
              className="search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search question or answer"
            />
          </label>
        </div>

        {isLoading ? (
          <p className="empty-state">Loading flashcards...</p>
        ) : filteredFlashcards.length === 0 ? (
          <p className="empty-state">No flashcards match this view yet.</p>
        ) : (
          <div className="flashcard-grid">
            {filteredFlashcards.map((flashcard) => {
              const isRevealed = revealedIds.includes(flashcard.id)
              const isEditing = editingFlashcardId === flashcard.id

              return (
                <article key={flashcard.id} className="study-card">
                  {isEditing ? (
                    <div className="stacked-form compact-form">
                      <label>
                        Deck
                        <select
                          value={editData.deck}
                          onChange={(event) =>
                            setEditData((current) => ({ ...current, deck: event.target.value }))
                          }
                        >
                          {decks.map((deck) => (
                            <option key={deck.id} value={deck.id}>
                              {deck.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Difficulty
                        <select
                          value={editData.difficulty}
                          onChange={(event) =>
                            setEditData((current) => ({ ...current, difficulty: event.target.value }))
                          }
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </label>
                      <label>
                        Question
                        <input
                          value={editData.question}
                          onChange={(event) =>
                            setEditData((current) => ({ ...current, question: event.target.value }))
                          }
                        />
                      </label>
                      <label>
                        Answer
                        <input
                          value={editData.answer}
                          onChange={(event) =>
                            setEditData((current) => ({ ...current, answer: event.target.value }))
                          }
                        />
                      </label>
                      <div className="button-row">
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => handleUpdateFlashcard(flashcard.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => setEditingFlashcardId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-meta">
                        <span className={`difficulty-badge ${flashcard.difficulty || 'medium'}`}>
                          {flashcard.difficulty || 'medium'}
                        </span>
                      </div>
                      <h3>{flashcard.question}</h3>
                      <div className={`answer-box ${isRevealed ? 'visible' : ''}`}>
                        {isRevealed ? flashcard.answer : 'Answer hidden'}
                      </div>
                      <div className="button-row">
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => handleReveal(flashcard.id)}
                        >
                          {isRevealed ? 'Hide answer' : 'Reveal answer'}
                        </button>
                        <button type="button" className="secondary-button" onClick={() => startEditing(flashcard)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDeleteFlashcard(flashcard.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}

export default Flashcards
