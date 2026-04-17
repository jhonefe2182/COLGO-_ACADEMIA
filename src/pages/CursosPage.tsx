import { useMemo, useState } from 'react'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { CourseCard } from '../components/courses/CourseCard'
import { type Course, type CourseModality } from '../services/mockData'
import { BookOpen, GraduationCap, Search } from 'lucide-react'
import { useColgo } from '../state/useColgo'

export function CursosPage() {
  const { courses } = useColgo()

  const [modality, setModality] = useState<'Todas' | CourseModality>('Todas')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Course | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCatalogModal, setShowCatalogModal] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState<{ open: boolean, course?: Course }>({ open: false })

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return courses.filter((c) => {
      const matchesModality = modality === 'Todas' || c.modality === modality
      const matchesQuery = !query || (c.title + ' ' + c.description + ' ' + c.level).toLowerCase().includes(query)
      return matchesModality && matchesQuery
    })
  }, [courses, modality, q])

  const openCourse = (course: Course) => setSelected(course)

  // Exportar cursos a CSV
  const handleExport = () => {
    if (!courses.length) return
    const headers = ['Título', 'Modalidad', 'Nivel', 'Duración (semanas)', 'Horas/semana', 'Descripción']
    const rows = courses.map(c => [c.title, c.modality, c.level, c.durationWeeks, c.weeklyHours, c.description])
    const csvContent = [headers, ...rows].map(r => r.map(x => `"${(x ?? '').toString().replace(/"/g, '""')}` + '"').join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cursos_${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Cursos</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Vista tipo cards con modalidad presencial/virtual (mock).</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<BookOpen size={16} />} onClick={() => setShowCatalogModal(true)}>
              Ver catálogo
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>Crear curso</Button>
            <Button variant="secondary" onClick={handleExport}>Exportar</Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <span className="mb-2 block text-xs font-semibold text-[var(--muted)]">Modalidad</span>
            <select
              value={modality}
              onChange={(e) => setModality(e.target.value as 'Todas' | CourseModality)}
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 text-sm text-[var(--text)]"
            >
              <option value="Todas">Todas</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
            </select>
          </label>
          <div className="flex items-end">
            <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-[rgba(251,191,36,0.30)] bg-[rgba(251,191,36,0.10)]">
                  <GraduationCap size={16} className="text-[var(--accent)]" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">Resultados</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{filtered.length} cursos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} onOpen={() => openCourse(course)} />
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Curso · ${selected.title}` : 'Curso'}
      >
        {selected ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-2">
                <Badge tone={selected.modality === 'Presencial' ? 'accent' : 'neutral'}>{selected.modality}</Badge>
                <Badge tone="neutral">{selected.level}</Badge>
              </div>
              <div className="text-xs text-[var(--muted)]">
                {selected.durationWeeks} semanas · {selected.weeklyHours}h/sem
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
              <p className="text-xs font-semibold text-[var(--muted)]">Descripción</p>
              <p className="mt-2 text-sm text-[var(--text)]">{selected.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">Incluye</p>
                <ul className="mt-2 space-y-2 text-sm text-[var(--text)]">
                  <li>Guías paso a paso</li>
                  <li>Plantillas de patrones</li>
                  <li>Acompañamiento del equipo</li>
                </ul>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">Resultados esperados</p>
                <ul className="mt-2 space-y-2 text-sm text-[var(--text)]">
                  <li>Proyectos con acabado profesional</li>
                  <li>Mejoras de técnica y fit</li>
                  <li>Portafolio de trabajos</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={() => setShowEnrollModal({ open: true, course: selected! })}>Inscribirme</Button>
            </div>
          </div>
        ) : null}
      </Modal>
      {/* Modal crear curso */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Crear curso">
        <div className="flex flex-col gap-4">
          <p className="text-sm">(Mock) Aquí iría el formulario para crear un curso.</p>
          <Button variant="primary" onClick={() => setShowCreateModal(false)}>Cerrar</Button>
        </div>
      </Modal>

      {/* Modal catálogo */}
      <Modal open={showCatalogModal} onClose={() => setShowCatalogModal(false)} title="Catálogo de cursos">
        <div className="flex flex-col gap-4">
          <p className="text-sm">(Mock) Aquí se mostraría el catálogo completo de cursos.</p>
          <Button variant="primary" onClick={() => setShowCatalogModal(false)}>Cerrar</Button>
        </div>
      </Modal>

      {/* Modal inscripción */}
      <Modal open={showEnrollModal.open} onClose={() => setShowEnrollModal({ open: false })} title="Inscribirse al curso">
        <div className="flex flex-col gap-4">
          <p className="text-sm">¿Deseas inscribirte en el curso <b>{showEnrollModal.course?.title}</b>?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowEnrollModal({ open: false })}>Cancelar</Button>
            <Button variant="primary" onClick={() => setShowEnrollModal({ open: false })}>Confirmar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

