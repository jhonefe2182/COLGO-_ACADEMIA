import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { Toast } from '../components/common/Toast'
import {
  asignarDocenteCurso,
  createAdminPrograma,
  createCursoModulo,
  getAdminCursos,
  getAdminDocentes,
  getAdminEstudiantes,
  getAdminProgramas,
  inscribirEstudiantesCurso,
} from '../services/apiClient'
import { Search } from 'lucide-react'
import { backofficePanelCardClass } from '../components/layout/backofficeVisual'
import { cn } from '../utils/cn'
import { saveBlobAs } from '../utils/saveFileAs'
import { withOptimisticUpdate } from '../utils/optimistic'

export function CursosPage() {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [programaFiltro, setProgramaFiltro] = useState<number | 'todos'>('todos')
  const [cursos, setCursos] = useState<Array<{
    id: number
    nombre: string
    codigo?: string
    descripcion?: string
    docente?: string
    programa?: string
    programa_id?: number | null
    capacidad?: number
    estudiantes_inscritos?: number
  }>>([])
  const [docentes, setDocentes] = useState<Array<{ id: number; nombre: string; apellido: string; email: string }>>([])
  const [estudiantes, setEstudiantes] = useState<Array<{ id: number; nombre: string; apellido: string; email: string }>>([])
  const [programas, setProgramas] = useState<Array<{ id: number; nombre: string; codigo: string; activo?: boolean }>>([])
  const [modulosRecientes, setModulosRecientes] = useState<Record<number, Array<{ titulo: string; orden: number }>>>({})

  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null)
  const [showProgramaModal, setShowProgramaModal] = useState(false)
  const [showModuloModal, setShowModuloModal] = useState(false)
  const [showAsignarModal, setShowAsignarModal] = useState(false)
  const [showInscribirModal, setShowInscribirModal] = useState(false)
  const [toast, setToast] = useState('')

  const [programaForm, setProgramaForm] = useState({ nombre: '', codigo: '', descripcion: '' })
  const [moduloForm, setModuloForm] = useState({ titulo: '', descripcion: '', orden: 1 })
  const [docenteId, setDocenteId] = useState<number | null>(null)
  const [estudianteIds, setEstudianteIds] = useState<number[]>([])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return cursos.filter((c) => {
      const matchesQuery = !query || `${c.nombre} ${c.codigo || ''} ${c.descripcion || ''}`.toLowerCase().includes(query)
      const matchesPrograma = programaFiltro === 'todos' || Number(c.programa_id || 0) === programaFiltro
      return matchesQuery && matchesPrograma
    })
  }, [cursos, q, programaFiltro])

  const metricas = useMemo(() => {
    const totalCursos = filtered.length
    const conDocente = filtered.filter((c) => Boolean(c.docente)).length
    const ocupacion = filtered.reduce((acc, c) => {
      const capacidad = Number(c.capacidad || 0)
      const inscritos = Number(c.estudiantes_inscritos || 0)
      if (!capacidad) return acc
      return acc + Math.min(100, Math.round((inscritos / capacidad) * 100))
    }, 0)
    const ocupacionPromedio = totalCursos > 0 ? Math.round(ocupacion / totalCursos) : 0
    const programasActivos = programas.filter((p) => p.activo !== false).length
    return {
      totalCursos,
      conDocente,
      sinDocente: Math.max(0, totalCursos - conDocente),
      ocupacionPromedio,
      programasActivos,
    }
  }, [filtered, programas])

  const alertas = useMemo(() => {
    const items: Array<{
      id: string
      prioridad: 'alta' | 'media' | 'baja'
      titulo: string
      detalle: string
      cursoId: number
      accion: 'asignar_docente' | 'inscribir_estudiantes'
    }> = []

    for (const c of filtered) {
      const capacidad = Number(c.capacidad || 0)
      const inscritos = Number(c.estudiantes_inscritos || 0)
      const ocupacion = capacidad > 0 ? Math.round((inscritos / capacidad) * 100) : 0

      if (!c.docente) {
        items.push({
          id: `sin-docente-${c.id}`,
          prioridad: 'alta',
          titulo: `Curso sin docente: ${c.nombre}`,
          detalle: 'Asigna un docente para habilitar clases y seguimiento académico.',
          cursoId: c.id,
          accion: 'asignar_docente',
        })
      }

      if (capacidad > 0 && ocupacion >= 90) {
        items.push({
          id: `alta-ocupacion-${c.id}`,
          prioridad: 'media',
          titulo: `Alta ocupación: ${c.nombre} (${ocupacion}%)`,
          detalle: 'Revisa apertura de nuevo grupo o aumento de capacidad.',
          cursoId: c.id,
          accion: 'inscribir_estudiantes',
        })
      }

      if (capacidad > 0 && ocupacion > 0 && ocupacion < 20) {
        items.push({
          id: `baja-ocupacion-${c.id}`,
          prioridad: 'baja',
          titulo: `Baja ocupación: ${c.nombre} (${ocupacion}%)`,
          detalle: 'Evalúa acciones comerciales o reprogramación.',
          cursoId: c.id,
          accion: 'inscribir_estudiantes',
        })
      }
    }

    return items.sort((a, b) => {
      const w = { alta: 3, media: 2, baja: 1 }
      return w[b.prioridad] - w[a.prioridad]
    })
  }, [filtered])

  const ejecutarAccionAlerta = (cursoId: number, accion: 'asignar_docente' | 'inscribir_estudiantes') => {
    setSelectedCursoId(cursoId)
    if (accion === 'asignar_docente') {
      setShowAsignarModal(true)
      return
    }
    setShowInscribirModal(true)
  }

  const selectedCurso = useMemo(
    () => cursos.find((c) => c.id === selectedCursoId) ?? null,
    [cursos, selectedCursoId],
  )

  const load = async () => {
    setCargando(true)
    setError(null)
    try {
      const [cursosApi, docentesApi, estudiantesApi, programasApi] = await Promise.all([
        getAdminCursos(),
        getAdminDocentes(),
        getAdminEstudiantes(),
        getAdminProgramas(),
      ])
      setCursos(Array.isArray(cursosApi) ? (cursosApi as typeof cursos) : [])
      setDocentes(Array.isArray(docentesApi) ? (docentesApi as typeof docentes) : [])
      setEstudiantes(Array.isArray(estudiantesApi) ? (estudiantesApi as typeof estudiantes) : [])
      setProgramas(Array.isArray(programasApi) ? (programasApi as typeof programas) : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la información académica.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const patchCursoLocal = (
    cursoId: number,
    updater: (curso: (typeof cursos)[number]) => (typeof cursos)[number],
  ) => {
    setCursos((prev) => prev.map((c) => (c.id === cursoId ? updater(c) : c)))
  }

  const getCursoById = (cursoId: number) => cursos.find((c) => c.id === cursoId) ?? null

  const handleExport = () => {
    void (async () => {
      if (!cursos.length) return
      const headers = ['Nombre', 'Código', 'Programa', 'Descripción', 'Docente', 'Inscritos', 'Capacidad']
      const rows = cursos.map((c) => [
        c.nombre,
        c.codigo || '',
        c.programa || '',
        c.descripcion || '',
        c.docente || 'Sin asignar',
        c.estudiantes_inscritos || 0,
        c.capacidad || 0,
      ])
      const csvContent = [headers, ...rows]
        .map((r) => r.map((x) => `"${(x ?? '').toString().replace(/"/g, '""')}` + '"').join(','))
        .join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      await saveBlobAs(blob, {
        suggestedName: `cursos_${new Date().toISOString().slice(0, 10)}.csv`,
        typeDescription: 'Cursos (CSV)',
      })
    })()
  }

  const crearPrograma = async () => {
    if (!programaForm.nombre || !programaForm.codigo) return
    const tempId = -Date.now()
    const optimisticPrograma = {
      id: tempId,
      nombre: programaForm.nombre,
      codigo: programaForm.codigo,
      activo: true,
    }
    const prevProgramas = programas
    try {
      await withOptimisticUpdate({
        applyOptimistic: () => {
          setProgramas((prev) => [optimisticPrograma, ...prev])
          setShowProgramaModal(false)
          setProgramaForm({ nombre: '', codigo: '', descripcion: '' })
          setToast('Programa creado (pendiente confirmación)')
          return () => setProgramas(prevProgramas)
        },
        request: () => createAdminPrograma(programaForm),
        onSuccess: async () => {
          setToast('Programa creado correctamente')
          await load()
        },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el programa')
    }
  }

  const crearModulo = async () => {
    if (!selectedCursoId || !moduloForm.titulo) return
    const prevModulos = modulosRecientes[selectedCursoId] || []
    const optimisticItem = { titulo: moduloForm.titulo, orden: Number(moduloForm.orden || 1) }
    try {
      await withOptimisticUpdate({
        applyOptimistic: () => {
          setModulosRecientes((prev) => ({
            ...prev,
            [selectedCursoId]: [optimisticItem, ...(prev[selectedCursoId] || [])].slice(0, 3),
          }))
          setShowModuloModal(false)
          setModuloForm({ titulo: '', descripcion: '', orden: 1 })
          setToast('Módulo creado (pendiente confirmación)')
          return () => setModulosRecientes((prev) => ({ ...prev, [selectedCursoId]: prevModulos }))
        },
        request: () => createCursoModulo(selectedCursoId, moduloForm),
        onSuccess: () => setToast('Módulo creado correctamente'),
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el módulo')
    }
  }

  const asignarDocente = async () => {
    if (!selectedCursoId || !docenteId) return
    const docente = docentes.find((d) => d.id === docenteId)
    const prevCurso = getCursoById(selectedCursoId)
    if (!docente || !prevCurso) return

    // Optimistic update: reflejar docente asignado de inmediato.
    try {
      await withOptimisticUpdate({
        applyOptimistic: () => {
          patchCursoLocal(selectedCursoId, (c) => ({
            ...c,
            docente: `${docente.nombre} ${docente.apellido}`.trim(),
          }))
          setShowAsignarModal(false)
          setDocenteId(null)
          setToast('Docente asignado al curso')
          return () => patchCursoLocal(selectedCursoId, () => prevCurso)
        },
        request: () => asignarDocenteCurso(selectedCursoId, docenteId),
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo asignar docente')
    }
  }

  const inscribirEstudiantes = async () => {
    if (!selectedCursoId || estudianteIds.length === 0) return
    const prevCurso = getCursoById(selectedCursoId)
    if (!prevCurso) return

    const optimisticAdded = estudianteIds.length
    try {
      await withOptimisticUpdate({
        applyOptimistic: () => {
          patchCursoLocal(selectedCursoId, (c) => ({
            ...c,
            estudiantes_inscritos: Number(c.estudiantes_inscritos || 0) + optimisticAdded,
          }))
          setShowInscribirModal(false)
          setEstudianteIds([])
          setToast(`Inscripciones procesando: ${optimisticAdded}`)
          return () => patchCursoLocal(selectedCursoId, () => prevCurso)
        },
        request: () => inscribirEstudiantesCurso(selectedCursoId, estudianteIds),
        onSuccess: (resp) => {
          patchCursoLocal(selectedCursoId, (c) => ({
            ...c,
            estudiantes_inscritos: Number(prevCurso.estudiantes_inscritos || 0) + Number(resp.inscritas || 0),
          }))
          setToast(`Inscripciones creadas: ${resp.inscritas}`)
        },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo inscribir estudiantes')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className={cn(backofficePanelCardClass, 'p-4 sm:p-5')}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Cursos</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Gestión académica conectada: programas, módulos, asignación docente e inscripción.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setShowProgramaModal(true)}>
              Nuevo programa
            </Button>
            <Button variant="primary" onClick={load}>
              Actualizar
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              Exportar
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--muted)]">Buscar</span>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--muted)]">
                <Search size={16} />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Título, nivel o descripción"
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--subtle)]"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--muted)]">Programa</span>
            <select
              value={programaFiltro}
              onChange={(e) => {
                const value = e.target.value
                setProgramaFiltro(value === 'todos' ? 'todos' : Number(value))
              }}
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 text-sm text-[var(--text)]"
            >
              <option value="todos">Todos los programas</option>
              {programas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.codigo})
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
              <p className="text-xs text-[var(--muted)]">Cursos</p>
              <p className="text-lg font-semibold text-[var(--text)]">{metricas.totalCursos}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
              <p className="text-xs text-[var(--muted)]">Programas activos</p>
              <p className="text-lg font-semibold text-[var(--text)]">{metricas.programasActivos}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-[var(--muted)]">Cursos con docente</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text)]">{metricas.conDocente}</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted)]">Cursos sin docente</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text)]">{metricas.sinDocente}</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted)]">Ocupación promedio</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text)]">{metricas.ocupacionPromedio}%</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Alertas operativas</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Priorizadas para seguimiento diario del administrador.</p>
          </div>
          <Badge tone={alertas.length > 0 ? 'warning' : 'success'}>
            {alertas.length} alertas
          </Badge>
        </div>
        <div className="mt-3 space-y-2">
          {alertas.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay alertas activas con los filtros actuales.</p>
          ) : (
            alertas.slice(0, 10).map((a) => (
              <div key={a.id} className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--text)]">{a.titulo}</p>
                  <Badge tone={a.prioridad === 'alta' ? 'danger' : a.prioridad === 'media' ? 'warning' : 'neutral'}>
                    {a.prioridad}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{a.detalle}</p>
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => ejecutarAccionAlerta(a.cursoId, a.accion)}
                  >
                    {a.accion === 'asignar_docente' ? 'Asignar docente' : 'Inscribir estudiantes'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {cargando ? <p className="text-sm text-[var(--muted)]">Cargando cursos...</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{c.nombre}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{c.codigo || 'Sin código'}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{c.programa || 'Sin programa'}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{c.descripcion || 'Sin descripción'}</p>
              </div>
              <Badge tone="neutral">{c.docente || 'Sin docente'}</Badge>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Inscritos: {c.estudiantes_inscritos || 0} / Capacidad: {c.capacidad || 0}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => { setSelectedCursoId(c.id); setShowModuloModal(true) }}>
                Crear módulo
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setSelectedCursoId(c.id); setShowAsignarModal(true) }}>
                Asignar docente
              </Button>
              <Button size="sm" onClick={() => { setSelectedCursoId(c.id); setShowInscribirModal(true) }}>
                Inscribir estudiantes
              </Button>
            </div>
            {(modulosRecientes[c.id]?.length || 0) > 0 ? (
              <div className="mt-2">
                <p className="text-xs text-[var(--muted)]">Módulos recientes:</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {modulosRecientes[c.id].map((m, idx) => (
                    <Badge key={`${m.titulo}-${idx}`} tone="neutral">
                      {m.orden}. {m.titulo}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      <Modal open={showProgramaModal} onClose={() => setShowProgramaModal(false)} title="Crear programa académico">
        <div className="space-y-2">
          <input value={programaForm.nombre} onChange={(e) => setProgramaForm((p) => ({ ...p, nombre: e.target.value }))} placeholder="Nombre" className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 text-sm" />
          <input value={programaForm.codigo} onChange={(e) => setProgramaForm((p) => ({ ...p, codigo: e.target.value }))} placeholder="Código" className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 text-sm" />
          <textarea value={programaForm.descripcion} onChange={(e) => setProgramaForm((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción" className="min-h-24 w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowProgramaModal(false)}>Cancelar</Button>
            <Button onClick={() => void crearPrograma()}>Guardar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showModuloModal} onClose={() => setShowModuloModal(false)} title={`Crear módulo · ${selectedCurso?.nombre || ''}`}>
        <div className="space-y-2">
          <input value={moduloForm.titulo} onChange={(e) => setModuloForm((p) => ({ ...p, titulo: e.target.value }))} placeholder="Título del módulo" className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 text-sm" />
          <input type="number" min={1} value={moduloForm.orden} onChange={(e) => setModuloForm((p) => ({ ...p, orden: Number(e.target.value || 1) }))} placeholder="Orden" className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 text-sm" />
          <textarea value={moduloForm.descripcion} onChange={(e) => setModuloForm((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción" className="min-h-24 w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowModuloModal(false)}>Cancelar</Button>
            <Button onClick={() => void crearModulo()}>Guardar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showAsignarModal} onClose={() => setShowAsignarModal(false)} title={`Asignar docente · ${selectedCurso?.nombre || ''}`}>
        <div className="space-y-2">
          <select value={docenteId ?? ''} onChange={(e) => setDocenteId(Number(e.target.value))} className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 text-sm">
            <option value="">Seleccionar docente</option>
            {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombre} {d.apellido} · {d.email}</option>)}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowAsignarModal(false)}>Cancelar</Button>
            <Button onClick={() => void asignarDocente()}>Asignar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showInscribirModal} onClose={() => setShowInscribirModal(false)} title={`Inscribir estudiantes · ${selectedCurso?.nombre || ''}`}>
        <div className="space-y-2">
          <div className="max-h-64 space-y-2 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-2">
            {estudiantes.map((e) => (
              <label key={e.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/40">
                <input
                  type="checkbox"
                  checked={estudianteIds.includes(e.id)}
                  onChange={(ev) => {
                    setEstudianteIds((prev) => {
                      if (ev.target.checked) return [...prev, e.id]
                      return prev.filter((id) => id !== e.id)
                    })
                  }}
                />
                <span className="text-sm">{e.nombre} {e.apellido} · {e.email}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowInscribirModal(false)}>Cancelar</Button>
            <Button onClick={() => void inscribirEstudiantes()}>Inscribir</Button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} show={Boolean(toast)} onClose={() => setToast('')} />
    </div>
  )
}

