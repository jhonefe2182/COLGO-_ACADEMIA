import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { getSupervisionUsuarioAdmin } from '../services/apiClient'

type SupervisionData = {
  modo_visual: boolean
  aviso: string
  usuario: {
    id: number
    email: string
    rol: string
    activo: boolean
    ultimo_acceso?: string | null
    nombre: string
  }
  panel: {
    cursos?: Array<Record<string, unknown>>
  }
}

export default function SupervisionUsuarioPage() {
  const [params] = useSearchParams()
  const [data, setData] = useState<SupervisionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const targetId = Number(params.get('target') || 0)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        if (!targetId) throw new Error('Usuario objetivo inválido para supervisión.')
        const res = await getSupervisionUsuarioAdmin(targetId)
        if (cancelled) return
        setData(res)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'No se pudo cargar la supervisión')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [targetId])

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Supervisión visual (solo lectura)</p>
          <p className="mt-1 leading-relaxed">
            Aquí ves datos de panel del usuario objetivo cargados por el servidor. No inicias sesión como él ni puedes modificar nada desde esta
            vista. Cierra esta pestaña cuando termines de revisar.
          </p>
        </div>
      </Card>
      {loading ? <Card><p className="text-sm text-[var(--muted)]">Cargando supervisión...</p></Card> : null}
      {error ? <Card><p className="text-sm text-red-700">{error}</p></Card> : null}
      {data ? (
        <>
          <Card>
            <p className="text-base font-semibold text-[var(--text)]">{data.aviso}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Rol: {data.usuario.rol} · Email: {data.usuario.email} · Estado: {data.usuario.activo ? 'Activo' : 'Bloqueado'}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Último acceso: {data.usuario.ultimo_acceso ? new Date(data.usuario.ultimo_acceso).toLocaleString('es-CO') : 'Sin registro'}
            </p>
          </Card>
          <Card>
            <p className="text-sm font-semibold text-[var(--text)]">Vista de interfaz (solo lectura)</p>
            {Array.isArray(data.panel.cursos) && data.panel.cursos.length > 0 ? (
              <div className="mt-3 space-y-2">
                {data.panel.cursos.map((curso, idx) => (
                  <div key={idx} className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm">
                    <p className="font-medium text-[var(--text)]">{String(curso.nombre || 'Curso')}</p>
                    <p className="text-xs text-[var(--muted)]">
                      Código: {String(curso.codigo || 'N/A')} · Estado: {String(curso.estado || 'N/A')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted)]">No hay cursos para mostrar en esta vista.</p>
            )}
          </Card>
        </>
      ) : null}
    </div>
  )
}
