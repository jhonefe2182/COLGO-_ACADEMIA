/**
 * API en Vercel (monorepo): mismo host que el frontend + `/_backend/api`.
 * Fallback fijo si hace falta (p. ej. tests sin `window`).
 */
export const PRODUCTION_API_BASE_URL = 'https://colgo-academia.vercel.app/_backend/api'

function envApiUrlTrimmed(): string {
  const v = import.meta.env.VITE_API_URL
  return v != null && String(v).trim() !== '' ? String(v).trim().replace(/\/$/, '') : ''
}

function isLocalhostUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url)
}

/** En el navegador desplegado (no localhost): prioriza mismo origen /_backend/api. */
export function resolveApiBaseUrl(): string {
  const fromEnv = envApiUrlTrimmed()
  const envOk = fromEnv !== '' && !isLocalhostUrl(fromEnv)

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    const isDeployedSite = host !== 'localhost' && host !== '127.0.0.1'
    if (isDeployedSite) {
      if (envOk) return fromEnv
      return `${window.location.origin}/_backend/api`.replace(/\/$/, '')
    }
  }

  if (import.meta.env.PROD) {
    if (envOk) return fromEnv
    return PRODUCTION_API_BASE_URL.replace(/\/$/, '')
  }

  if (fromEnv !== '') return fromEnv
  return 'http://localhost:3001/api'
}
