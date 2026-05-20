import { useEffect, useState } from 'react'
import { createDeck, deleteDeck, getDecks, updateDeck } from '../services/deckApi'

function Decks({ selectedDeckId, onSelectDeck, onNavigate }) {
  const [decks, setDecks] = useState([])
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [editingDeckId, setEditingDeckId] = useState(null)
  const [editData, setEditData] = useState({ title: '', description: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const loadDecks = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      const savedDecks = await getDecks()
      setDecks(savedDecks)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDecks()
  }, [])

  const handleCreateDeck = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const createdDeck = await createDeck(formData)
      setDecks((current) => [createdDeck, ...current])
      setFormData({ title: '', description: '' })
      onSelectDeck(createdDeck)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditing = (deck) => {
    setEditingDeckId(deck.id)
    setEditData({ title: deck.title, description: deck.description || '' })
  }

  const handleUpdateDeck = async (deckId) => {
    setErrorMessage('')

    try {
      const updatedDeck = await updateDeck(deckId, editData)
      setDecks((current) => current.map((deck) => (deck.id === deckId ? updatedDeck : deck)))
      setEditingDeckId(null)
      onSelectDeck(updatedDeck)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleDeleteDeck = async (deckId) => {
    const shouldDelete = window.confirm('Delete this deck? Flashcards linked to it may remain unavailable.')

    if (!shouldDelete) {
      return
    }

    setErrorMessage('')

    try {
      await deleteDeck(deckId)
      setDecks((current) => current.filter((deck) => deck.id !== deckId))
      if (selectedDeckId === deckId) {
        onSelectDeck(null)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <section className="page-grid">
      <div className="page-heading">
        <p className="eyebrow">Decks</p>
        <h1>Organise study topics</h1>
        <p className="muted-text">Create topic-based decks and open one to focus its flashcards.</p>
      </div>

      {errorMessage && <p className="status-message error-message">{errorMessage}</p>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">New Deck</p>
            <h2>Create a study collection</h2>
          </div>
        </div>
        <form className="inline-form" onSubmit={handleCreateDeck}>
          <label>
            Title
            <input
              value={formData.title}
              onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
              placeholder="JavaScript fundamentals"
              required
            />
          </label>
          <label>
            Description
            <input
              value={formData.description}
              onChange={(event) =>
                setFormData((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Core concepts for exam revision"
            />
          </label>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      </section>

      <section className="deck-grid">
        {isLoading ? (
          <p className="empty-state">Loading decks...</p>
        ) : decks.length === 0 ? (
          <p className="empty-state">No decks yet. Create your first deck above.</p>
        ) : (
          decks.map((deck) => {
            const isEditing = editingDeckId === deck.id
            const isSelected = selectedDeckId === deck.id

            return (
              <article key={deck.id} className={`deck-card ${isSelected ? 'selected' : ''}`}>
                {isEditing ? (
                  <div className="stacked-form compact-form">
                    <label>
                      Title
                      <input
                        value={editData.title}
                        onChange={(event) =>
                          setEditData((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Description
                      <input
                        value={editData.description}
                        onChange={(event) =>
                          setEditData((current) => ({ ...current, description: event.target.value }))
                        }
                      />
                    </label>
                    <div className="button-row">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => handleUpdateDeck(deck.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setEditingDeckId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="eyebrow">{isSelected ? 'Selected deck' : 'Deck'}</p>
                      <h2>{deck.title}</h2>
                      <p className="muted-text">{deck.description || 'No description provided.'}</p>
                    </div>
                    <div className="button-row">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => {
                          onSelectDeck(deck)
                          onNavigate('flashcards')
                        }}
                      >
                        Open
                      </button>
                      <button type="button" className="secondary-button" onClick={() => startEditing(deck)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDeleteDeck(deck.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })
        )}
      </section>
    </section>
  )
}

export default Decks
