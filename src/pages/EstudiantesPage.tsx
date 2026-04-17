import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { DataTable, type Column } from '../components/common/Table'
import { Modal } from '../components/common/Modal'
import { CreateStudentForm, type CreateStudentFormData } from '../components/students/CreateStudentForm'
import { type Student, type StudentStatus } from '../services/mockData'
import { StudentService } from '../services/studentSupabase'
import type { StudentInsert } from '../services/studentSupabase'
import { Download, Eye, Plus, Trash2, Edit } from 'lucide-react'

function statusTone(status: StudentStatus): 'success' | 'warning' | 'danger' | 'neutral' | 'accent' {
  if (status === 'Activo') return 'success'
  if (status === 'Pendiente') return 'warning'
  if (status === 'Inactivo') return 'danger'
  return 'neutral'
}

export function EstudiantesPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Todos' | StudentStatus>('Todos')
  const [sedeFiltro, setSedeFiltro] = useState<'Todas' | string>('Todas')
  const [sedes, setSedes] = useState<{ id: string; city: string }[]>([])
  const [loadingSedes, setLoadingSedes] = useState(true)
    // Cargar sedes para el filtro
    useEffect(() => {
      const fetchSedes = async () => {
        setLoadingSedes(true)
        try {
          const { data, error } = await import('../lib/supabaseClient').then(m => m.supabase.from('sedes').select('id, city').order('city', { ascending: true }))
          if (error) throw new Error(error.message)
          setSedes(data || [])
        } catch (err) {
          setSedes([
            { id: 'loc_001', city: 'Medellín' },
            { id: 'loc_002', city: 'Bogotá' },
            { id: 'loc_003', city: 'Virtual' },
          ])
        } finally {
          setLoadingSedes(false)
        }
      }
      fetchSedes()
    }, [])
  const [selected, setSelected] = useState<Student | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editStudent, setEditStudent] = useState<any>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar estudiantes desde Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const data = await StudentService.list()
        setStudents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estudiantes')
      } finally {
        setIsLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const reloadStudents = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const data = await StudentService.list()
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estudiantes')
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return students.filter((s) => {
      const matchesQuery = !query || (s.name + ' ' + s.document + ' ' + s.courseTitle).toLowerCase().includes(query)
      const matchesStatus = status === 'Todos' || s.status === status
      const matchesSede = sedeFiltro === 'Todas' || s.sede === sedeFiltro
      return matchesQuery && matchesStatus && matchesSede
    })
  }, [q, sedeFiltro, status, students, sedes])

  const handleCreateStudent = async (formData: CreateStudentFormData) => {
    setIsCreating(true)
    setError(null)
    setSuccess(null)
    try {
      const payload: StudentInsert = {
        name: formData.name,
        document: formData.document,
        sede_id: formData.sede_id,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
      }
      await StudentService.create(payload)
      await reloadStudents()
      setShowCreateModal(false)
      setSuccess('Estudiante creado correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear estudiante')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este estudiante?')) return
    setError(null)
    setSuccess(null)
    try {
      await StudentService.remove(id)
      await reloadStudents()
      setSelected(null)
      setSuccess('Estudiante eliminado correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar estudiante')
    }
  }

  const handleEditStudent = async (formData: CreateStudentFormData) => {
    if (!editStudent) return
    setIsEditing(true)
    setError(null)
    setSuccess(null)
    try {
      await StudentService.update(editStudent.id, {
        name: formData.name,
        document: formData.document,
        sede_id: formData.sede_id,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
      })
      await reloadStudents()
      setEditStudent(null)
      setSuccess('Estudiante editado correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al editar estudiante')
    } finally {
      setIsEditing(false)
    }
  }

  // Cuando se pulse editar, buscar datos completos
  const handleOpenEdit = async (student: Student) => {
    setEditLoading(true)
    setError(null)
    try {
      // Buscar datos completos en Supabase
      const { data, error } = await import('../lib/supabaseClient').then(m => m.supabase
        .from('students')
        .select('*')
        .eq('id', student.id)
        .single())
      if (error) throw new Error(error.message)
      setEditStudent({
        ...student,
        sede_id: data.sede_id || '',
        email: data.email || '',
        phone: data.phone || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos para editar')
    } finally {
      setEditLoading(false)
    }
  }

  const columns: Column<Student>[] = [
    {
      header: 'Estudiante',
      className: 'min-w-[240px]',
      render: (s) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[var(--text)]">{s.name}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">{s.document}</div>
        </div>
      ),
    },
    {
      header: 'Curso',
      className: 'min-w-[220px]',
      render: (s) => <div className="text-sm text-[var(--text)]">{s.courseTitle}</div>,
    },
    {
      header: 'Sede',
      className: 'min-w-[140px]',
      render: (s) => <Badge tone={s.sede === 'Virtual' ? 'neutral' : 'accent'}>{s.sede}</Badge>,
    },
    {
      header: 'Estado',
      className: 'min-w-[160px]',
      render: (s) => <Badge tone={statusTone(s.status)}>{s.status}</Badge>,
    },
    {
      header: '',
      className: 'w-[92px]',
      render: (s) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setSelected(s)} leftIcon={<Eye size={16} />}>
            Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(s)} leftIcon={<Edit size={16} />} disabled={editLoading}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(s.id)} leftIcon={<Trash2 size={16} />}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  const stats = useMemo(() => {
    const active = students.filter((s) => s.status === 'Activo').length
    const pending = students.filter((s) => s.status === 'Pendiente').length
    const inactive = students.filter((s) => s.status === 'Inactivo').length
    return { active, pending, inactive }
  }, [students])

  // Exportar estudiantes a CSV
  const handleExport = () => {
    if (!students.length) return
    const headers = ['Nombre', 'Documento', 'Curso', 'Sede', 'Estado']
    const rows = students.map(s => [s.name, s.document, s.courseTitle, s.sede, s.status])
    const csvContent = [headers, ...rows].map(r => r.map(x => `"${(x ?? '').toString().replace(/"/g, '""')}` + '"').join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `estudiantes_${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  return (
    <div className="flex flex-col gap-4">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-semibold text-green-800 mb-1">Éxito:</p>
          <p className="text-sm text-green-700 whitespace-pre-wrap">{success}</p>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Estudiantes</p>
                <p className="mt-1 text-xs text-[rgba(255,255,255,0.60)]">
                  Tabla moderna con filtros y estado del estudiante (todo con datos mock).
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" leftIcon={<Download size={16} />} onClick={handleExport}>
                  Exportar
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Nuevo
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[var(--muted)]">Buscar</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nombre, documento o curso"
                  className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--subtle)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[var(--muted)]">Estado</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Todos' | StudentStatus)}
                  className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Todos">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[var(--muted)]">Sede</span>
                <select
                  value={sedeFiltro}
                  onChange={(e) => setSedeFiltro(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  disabled={loadingSedes}
                >
                  <option value="Todas">Todas</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.city}>{sede.city}</option>
                  ))}
                </select>
              </label>
            </div>
          </Card>

          <Card>
            {isLoading ? (
              <div className="p-6 text-center text-sm text-[var(--muted)]">Cargando estudiantes...</div>
            ) : error ? (
              <div className="p-6 text-center text-sm text-red-500">{error}</div>
            ) : (
              <DataTable
                columns={columns}
                rows={filtered}
                getRowId={(s) => s.id}
                emptyState="No se encontraron estudiantes con esos filtros."
              />
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-sm font-semibold text-[var(--text)]">Resumen</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Distribución por estado (mock).</p>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(34,197,94,0.85)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">Activos</span>
                </div>
                <span className="text-sm font-semibold text-[var(--text)]">{stats.active}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(251,191,36,0.85)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">Pendientes</span>
                </div>
                <span className="text-sm font-semibold text-[var(--text)]">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(239,68,68,0.85)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">Inactivos</span>
                </div>
                <span className="text-sm font-semibold text-[var(--text)]">{stats.inactive}</span>
              </div>
            </div>
          </Card>
          <Card>
            <p className="text-sm font-semibold text-[var(--text)]">Tip</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Usa los filtros para simular búsqueda y segmentación por sede/estado. Luego se conecta con APIs reales sin tocar el UI.
            </p>
          </Card>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => {
          setSelected(null)
          setError(null)
          setSuccess(null)
        }}
        title={selected ? `Estudiante · ${selected.name}` : 'Estudiante'}
      >
        {selected ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.60)]">Documento</p>
                <p className="mt-1 text-sm font-semibold text-[rgba(255,255,255,0.92)]">{selected.document}</p>
              </div>
              <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.60)]">Curso</p>
                <p className="mt-1 text-sm text-[rgba(255,255,255,0.88)]">{selected.courseTitle}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.60)]">Sede</p>
                <p className="mt-1 text-sm text-[rgba(255,255,255,0.88)]">{selected.sede}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
              <p className="text-xs font-semibold text-[rgba(255,255,255,0.60)]">ID</p>
              <p className="mt-1 text-sm text-[rgba(255,255,255,0.88)]">{selected.id}</p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal para crear estudiante */}

      <Modal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setError(null)
          setSuccess(null)
        }}
        title="Crear Nuevo Estudiante"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false)
                setError(null)
                setSuccess(null)
              }}
              disabled={isCreating}
            >
              Cancelar
            </Button>
          </div>
        }
      >
        <CreateStudentForm onSubmit={handleCreateStudent} loading={isCreating} />
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      </Modal>

      {/* Modal para editar estudiante */}
      <Modal
        open={!!editStudent}
        onClose={() => {
          setEditStudent(null)
          setError(null)
          setSuccess(null)
        }}
        title={editStudent ? `Editar Estudiante · ${editStudent.name}` : 'Editar Estudiante'}
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setEditStudent(null)
                setError(null)
                setSuccess(null)
              }}
              disabled={isEditing}
            >
              Cancelar
            </Button>
          </div>
        }
      >
        {editStudent && (
          <CreateStudentForm
            onSubmit={handleEditStudent}
            loading={isEditing}
            initialData={editStudent}
          />
        )}
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      </Modal>
    </div>
  )
}

