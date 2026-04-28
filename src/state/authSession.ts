export type UserRole = 'admin' | 'estudiante' | 'docente' | 'staff'

export type SessionUser = {
  rol: UserRole
  [key: string]: unknown
}

const TOKEN_KEY = 'token'
const USER_KEY = 'usuario'
let tokenCache: string | null = null
let userCache: SessionUser | null | undefined = undefined

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

function hasTokenUserMismatch(token: string, user: SessionUser): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  const tokenRol = String(payload.rol ?? '')
  const tokenId = Number(payload.id ?? NaN)
  const userRol = String(user.rol ?? '')
  const userId = Number((user as Record<string, unknown>).id ?? NaN)
  if (tokenRol && userRol && tokenRol !== userRol) return true
  if (Number.isFinite(tokenId) && Number.isFinite(userId) && tokenId !== userId) return true
  return false
}

function hydrateFromStorage() {
  if (userCache !== undefined) return
  const token = localStorage.getItem(TOKEN_KEY)
  const usuario = localStorage.getItem(USER_KEY)
  if (!token || !usuario) {
    tokenCache = null
    userCache = null
    return
  }
  try {
    const parsed = JSON.parse(usuario) as SessionUser
    if (!parsed?.rol) {
      tokenCache = null
      userCache = null
      return
    }
    if (hasTokenUserMismatch(token, parsed)) {
      tokenCache = null
      userCache = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      return
    }
    tokenCache = token
    userCache = parsed
  } catch {
    tokenCache = null
    userCache = null
  }
}

export function getDashboardPathByRole(rol: UserRole): string {
  if (rol === 'admin') return '/admin'
  if (rol === 'staff') return '/staff'
  if (rol === 'estudiante') return '/estudiante'
  return '/docente'
}

export function persistSession(token: string, usuario: SessionUser): void {
  tokenCache = token
  userCache = usuario
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(usuario))
}

export function clearSession(): void {
  tokenCache = null
  userCache = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function loadSessionUser(): SessionUser | null {
  hydrateFromStorage()
  return userCache ?? null
}

export function getSessionToken(): string | null {
  hydrateFromStorage()
  return tokenCache ?? null
}
