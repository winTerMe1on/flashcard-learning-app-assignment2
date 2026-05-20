import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login({ onShowRegister }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login({ email, password })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">FC</div>
          <div>
            <p className="eyebrow">Flashcard Learning</p>
            <h1>Sign in to your study dashboard</h1>
          </div>
        </div>
        <p className="muted-text auth-subtitle">
          Manage decks, practise flashcards, and track learning progress in one polished workspace.
        </p>

        {errorMessage && <p className="status-message error-message">{errorMessage}</p>}

        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          <button className="primary-button full-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New here?{' '}
          <button type="button" onClick={onShowRegister}>
            Create an account
          </button>
        </p>
      </section>
    </main>
  )
}

export default Login
