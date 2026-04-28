import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getDashboardPathByRole, loadSessionUser, type UserRole } from '../state/authSession'

interface ProtectedRouteProps {
  children: React.ReactNode
  rol?: UserRole
}

export function ProtectedRoute({ children, rol }: ProtectedRouteProps) {
  const [usuario] = useState(loadSessionUser)
  const location = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (location.pathname === '/actualizar-password' && !usuario.cambiar_password) {
    return <Navigate to={getDashboardPathByRole(usuario.rol)} replace />
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
