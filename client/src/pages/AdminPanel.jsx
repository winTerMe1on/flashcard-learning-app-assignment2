import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAdminHistory } from '../services/historyApi'

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function AdminPanel() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadAdminHistory = async () => {
      if (user?.role !== 'admin') {
        setIsLoading(false)
        return
      }

      setErrorMessage('')
      setIsLoading(true)

      try {
        const records = await getAdminHistory()
        setHistory(records)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminHistory()
  }, [user?.role])

  if (user?.role !== 'admin') {
    return (
      <section className="page-grid">
        <div className="page-heading">
          <p className="eyebrow">Admin Panel</p>
          <h1>Admin access required</h1>
          <p className="muted-text">This section is visible only to users with the admin role.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="page-grid">
      <div className="page-heading">
        <p className="eyebrow">Admin Panel</p>
        <h1>All learning activity</h1>
        <p className="muted-text">Review study events across all users, decks, and flashcards.</p>
      </div>

      {errorMessage && <p className="status-message error-message">{errorMessage}</p>}

      <section className="panel table-panel">
        {isLoading ? (
          <p className="empty-state">Loading admin history...</p>
        ) : history.length === 0 ? (
          <p className="empty-state">No learning history has been recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Flashcard</th>
                  <th>Deck</th>
                  <th>Action</th>
                  <th>Viewed</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>{record.user?.name || 'Unknown user'}</td>
                    <td>{record.user?.email || 'Unavailable'}</td>
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

export default AdminPanel
