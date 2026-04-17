import { createContext } from 'react'

type AuthContextType = {
  authenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)