import { useEffect, useState } from 'react'
import { getMyHistory } from '../services/historyApi'

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function History() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      setErrorMessage('')
      setIsLoading(true)

      try {
        const records = await getMyHistory()
        setHistory(records)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  return (
    <section className="page-grid">
      <div className="page-heading">
        <p className="eyebrow">Learning History</p>
        <h1>Your study activity</h1>
        <p className="muted-text">Every answer reveal is recorded as evidence of practice.</p>
      </div>

      {errorMessage && <p className="status-message error-message">{errorMessage}</p>}

      <section className="panel table-panel">
        {isLoading ? (
          <p className="empty-state">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="empty-state">No learning history yet. Reveal an answer to create your first record.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Flashcard</th>
                  <th>Deck</th>
                  <th>Action</th>
                  <th>Viewed</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>{record.flashcard?.question || 'Deleted flashcard'}</td>
                    <td>{record.deck?.title || 'No deck'}</td>
                    <td>{record.action}</td>
                    <td>{formatDateTime(record.viewedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}

export default History
