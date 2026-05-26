import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { base44 } from '@/api/base44Client'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [appPublicSettings, setAppPublicSettings] = useState(null)

  const checkUserAuth = async () => {
    setIsLoadingAuth(true)
    try {
      const currentUser = await base44.auth.me()
      setUser(currentUser)
      setIsAuthenticated(true)
      setAuthError(null)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      if (error?.status === 401 || error?.status === 403) {
        clearAccessToken()
        setAuthError({ type: 'auth_required', message: 'Authentication required' })
      } else {
        setAuthError({ type: 'unknown', message: error?.message || 'Failed to load user' })
      }
    } finally {
      setIsLoadingAuth(false)
      setAuthChecked(true)
    }
  }

  const checkAppState = async () => {
    setIsLoadingPublicSettings(false)
    setAuthError(null)
    setAppPublicSettings(null)
    if (getAccessToken()) {
      await checkUserAuth()
      return
    }
    setIsLoadingAuth(false)
    setAuthChecked(true)
  }

  useEffect(() => {
    void checkAppState()
  }, [])

  const login = async (email, password) => {
    const response = await base44.auth.loginViaEmailPassword(email, password)
    if (response?.access_token) {
      setAccessToken(response.access_token)
    }
    setUser(response.user)
    setIsAuthenticated(true)
    setAuthError(null)
    return response
  }

  const register = async (payload) => {
    const response = await base44.auth.register(payload)
    if (response?.access_token) {
      setAccessToken(response.access_token)
    }
    setUser(response.user)
    setIsAuthenticated(true)
    setAuthError(null)
    return response
  }

  const logout = (shouldRedirect = true) => {
    clearAccessToken()
    setUser(null)
    setIsAuthenticated(false)
    if (shouldRedirect && typeof window !== 'undefined') {
      window.location.assign('/login')
    }
  }

  const navigateToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.assign('/login')
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
      login,
      register,
    }),
    [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings, authChecked],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
