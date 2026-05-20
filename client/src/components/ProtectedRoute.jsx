import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, fallback }) {
  const { isAuthenticated, isCheckingAuth } = useAuth()

  if (isCheckingAuth) {
    return (
      <main className="auth-shell">
        <section className="auth-panel compact-panel">
          <p className="eyebrow">Loading</p>
          <h1>Restoring your session</h1>
          <p className="muted-text">Checking your saved login with the backend.</p>
        </section>
      </main>
    )
  }

  if (!isAuthenticated) {
    return fallback
  }

  return children
}

export default ProtectedRoute
