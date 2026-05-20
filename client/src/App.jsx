import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import AdminPanel from './pages/AdminPanel'
import Dashboard from './pages/Dashboard'
import Decks from './pages/Decks'
import Flashcards from './pages/Flashcards'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'

function AuthScreens() {
  const [authView, setAuthView] = useState('login')

  return authView === 'login' ? (
    <Login onShowRegister={() => setAuthView('register')} />
  ) : (
    <Register onShowLogin={() => setAuthView('login')} />
  )
}

function AppContent() {
  const { user } = useAuth()
  const [activePage, setActivePage] = useState('dashboard')
  const [selectedDeck, setSelectedDeck] = useState(null)

  const handleNavigate = (page) => {
    if (page === 'admin' && user?.role !== 'admin') {
      setActivePage('dashboard')
      return
    }

    setActivePage(page)
  }

  const renderPage = () => {
    if (activePage === 'decks') {
      return (
        <Decks
          selectedDeckId={selectedDeck?.id || ''}
          onSelectDeck={setSelectedDeck}
          onNavigate={handleNavigate}
        />
      )
    }

    if (activePage === 'flashcards') {
      return <Flashcards selectedDeckId={selectedDeck?.id || ''} onSelectDeck={setSelectedDeck} />
    }

    if (activePage === 'history') {
      return <History />
    }

    if (activePage === 'admin') {
      return <AdminPanel />
    }

    return <Dashboard onNavigate={handleNavigate} />
  }

  return (
    <ProtectedRoute fallback={<AuthScreens />}>
      <Layout activePage={activePage} onNavigate={handleNavigate}>
        {selectedDeck && activePage === 'flashcards' && (
          <div className="selected-banner">
            Studying deck: <strong>{selectedDeck.title}</strong>
          </div>
        )}
        {renderPage()}
      </Layout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
