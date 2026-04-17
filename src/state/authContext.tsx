

import { useMemo, useState, type ReactNode } from 'react'
import { isAuthenticated, clearAuth } from './authUtils'
import { AuthContext } from './authContextProvider'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())

  const login = (username: string, password: string) => {
    const cleanedUsername = username.trim().toUpperCase()
    if (cleanedUsername === 'MARIO' && password === '123') {
      window.localStorage.setItem('colgo-authenticated', 'true')
      setAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    clearAuth()
    setAuthenticated(false)
  }

  const value = useMemo(
    () => ({ authenticated, login, logout }),
    [authenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


