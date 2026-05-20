/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearStoredToken, getStoredToken, storeToken } from '../services/api'
import { getCurrentUser, loginUser, registerUser } from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getStoredToken())
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsCheckingAuth(false)
        return
      }

      try {
        const data = await getCurrentUser()
        setUser(data.user)
      } catch {
        clearStoredToken()
        setToken(null)
        setUser(null)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    restoreSession()
  }, [token])

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    storeToken(data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (userDetails) => {
    const data = await registerUser(userDetails)
    storeToken(data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    clearStoredToken()
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isCheckingAuth,
      login,
      logout,
      register,
    }),
    [user, token, isCheckingAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
