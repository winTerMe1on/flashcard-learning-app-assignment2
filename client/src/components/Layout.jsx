import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', marker: '01' },
  { id: 'decks', label: 'Decks', marker: '02' },
  { id: 'flashcards', label: 'Flashcards', marker: '03' },
  { id: 'history', label: 'Learning History', marker: '04' },
]

function Layout({ activePage, onNavigate, children }) {
  const { logout, user } = useAuth()
  const visibleNavItems =
    user?.role === 'admin'
      ? [...navItems, { id: 'admin', label: 'Admin Panel', marker: '05' }]
      : navItems

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">FC</div>
          <div>
            <p className="eyebrow">Assignment 2</p>
            <h1>Flashcard Learning App</h1>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span>{item.marker}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="eyebrow">Mode</p>
          <strong>{user?.role === 'admin' ? 'Administrator demo' : 'Student workspace'}</strong>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>{user?.name || 'Student'}</h2>
          </div>

          <div className="user-actions">
            <div className="user-chip">
              <span>{user?.email}</span>
              <strong>{user?.role}</strong>
            </div>
            <button type="button" className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content-shell">{children}</main>
      </div>
    </div>
  )
}

export default Layout
