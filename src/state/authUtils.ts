// Funciones auxiliares para autenticación

export function isAuthenticated(): boolean {
  try {
    return window.localStorage.getItem('colgo-authenticated') === 'true'
  } catch {
    return false
  }
}

export function clearAuth(): void {
  window.localStorage.removeItem('colgo-authenticated')
}
