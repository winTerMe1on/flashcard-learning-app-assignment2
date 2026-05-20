import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Register({ onShowLogin }) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await register(formData)
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
            <p className="eyebrow">Create Account</p>
            <h1>Build your personal flashcard library</h1>
          </div>
        </div>
        <p className="muted-text auth-subtitle">
          Register as a user for normal study mode, or as admin for demonstration access.
        </p>

        {errorMessage && <p className="status-message error-message">{errorMessage}</p>}

        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="student@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="At least 6 characters"
              minLength="6"
              required
            />
          </label>

          <label>
            Role
            <select value={formData.role} onChange={(event) => updateField('role', event.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button className="primary-button full-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already registered?{' '}
          <button type="button" onClick={onShowLogin}>
            Back to login
          </button>
        </p>
      </section>
    </main>
  )
}

export default Register
