import { useEffect, useState } from 'react'
import { getDecks } from '../services/deckApi'
import { getFlashcards } from '../services/flashcardApi'
import { getMyHistory } from '../services/historyApi'

function Dashboard({ onNavigate }) {
  const [summary, setSummary] = useState({ decks: 0, flashcards: 0, history: 0 })
  const [recentHistory, setRecentHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setErrorMessage('')
      setIsLoading(true)

      try {
        const [decks, flashcards, history] = await Promise.all([
          getDecks(),
          getFlashcards(),
          getMyHistory(),
        ])

        setSummary({
          decks: decks.length,
          flashcards: flashcards.length,
          history: history.length,
        })
        setRecentHistory(history.slice(0, 4))
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <section className="page-grid">
      <div className="page-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Your study overview</h1>
        <p className="muted-text">
          A complete flashcard learning system with authenticated users, owned decks, study cards,
          learning history, and admin reporting.
        </p>
      </div>

      {errorMessage && <p className="status-message error-message">{errorMessage}</p>}

      <div className="stat-grid">
        <article className="stat-card">
          <span>Decks</span>
          <strong>{isLoading ? '...' : summary.decks}</strong>
          <p>Topic collections available for study.</p>
        </article>
        <article className="stat-card">
          <span>Flashcards</span>
          <strong>{isLoading ? '...' : summary.flashcards}</strong>
          <p>Question and answer cards across your decks.</p>
        </article>
        <article className="stat-card">
          <span>History Events</span>
          <strong>{isLoading ? '...' : summary.history}</strong>
          <p>Tracked answer reveals from your sessions.</p>
        </article>
      </div>

      <div className="two-column">
        <section className="panel spotlight-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Quick Start</p>
              <h2>Demo-ready workflow</h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => onNavigate('flashcards')}>
              Start studying
            </button>
          </div>
          <div className="workflow-list">
            <p><strong>1.</strong> Create a deck for a subject or topic.</p>
            <p><strong>2.</strong> Add flashcards with difficulty labels.</p>
            <p><strong>3.</strong> Reveal answers to record learning history automatically.</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Activity</p>
              <h2>Recent learning</h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => onNavigate('history')}>
              View history
            </button>
          </div>
          {isLoading ? (
            <p className="empty-state">Loading recent activity...</p>
          ) : recentHistory.length === 0 ? (
            <p className="empty-state">No learning history yet. Reveal a flashcard answer to begin tracking.</p>
          ) : (
            <div className="compact-list">
              {recentHistory.map((item) => (
                <article key={item.id} className="compact-row">
                  <strong>{item.flashcard?.question || 'Deleted flashcard'}</strong>
                  <span>{new Date(item.viewedAt).toLocaleString()}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default Dashboard
