import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { changePassword } from '../services/apiClient'
import { getDashboardPathByRole, getSessionToken, loadSessionUser, persistSession } from '../state/authSession'

export function ActualizarPasswordPage() {
  const navigate = useNavigate()
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setOk(null)

    if (!nueva || !confirmar) {
      setError('Completa los dos campos.')
      return
    }
    if (nueva.length < 8) {
      setError('La nueva contraseña debe tener mínimo 8 caracteres.')
      return
    }
    if (nueva !== confirmar) {
      setError('La confirmación de contraseña no coincide.')
      return
    }

    setGuardando(true)
    try {
      await changePassword(null, nueva)
      const usuario = loadSessionUser()
      if (usuario) {
        persistSession(getSessionToken() || '', { ...usuario, cambiar_password: false })
        setOk('Contraseña actualizada. Redirigiendo al panel...')
        navigate(getDashboardPathByRole(usuario.rol), { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
        <p className="text-sm font-semibold text-[var(--muted)]">Primer ingreso</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--text)]">Actualizar contraseña</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Por seguridad, define una nueva contraseña para continuar.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {ok ? <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</div> : null}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">Nueva contraseña</span>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">Confirmar contraseña</span>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>

          <Button type="submit" className="w-full" disabled={guardando}>
            {guardando ? 'Actualizando...' : 'Guardar y continuar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
