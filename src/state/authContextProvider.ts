import { createContext } from 'react'

export type AuthUsuario = {
  id: number
  username: string
  rol: 'admin' | 'estudiante' | 'docente' | 'staff'
}

export type AuthContextType = {
  usuario: AuthUsuario | null
  authenticated: boolean
  cargando: boolean
  error: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
  registrar: (datos: unknown) => Promise<boolean>
  esAutenticado: boolean
  token: string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)