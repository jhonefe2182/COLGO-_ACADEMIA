import type { UserRole } from '../../state/authSession'
import { cn } from '../../utils/cn'

/** Etiqueta del modo de interfaz (misma lógica en sidebar, ficha y cabeceras). */
export function rolEtiqueta(rol?: UserRole): string {
  if (rol === 'admin') return 'Administración'
  if (rol === 'staff') return 'Staff'
  if (rol === 'docente') return 'Docencia'
  if (rol === 'estudiante') return 'Estudiante'
  return 'Usuario'
}

type ColgoBrandBlockProps = {
  /** Texto del chip inferior (p. ej. rol de la sesión). */
  badgeLabel: string
  className?: string
}

/**
 * Bloque superior COLGO / Academia / lema + chip de contexto.
 * Mismo aspecto en panel principal (sidebar) y ficha de miembro.
 */
export function ColgoBrandBlock({ badgeLabel, className }: ColgoBrandBlockProps) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden border-b border-white/10',
        'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
        'px-5 pb-5 pt-5',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-90"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-[var(--accent)]/16 blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-8 -left-10 h-24 w-24 rounded-full bg-amber-300/10 blur-xl" aria-hidden />
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">COLGO</p>
      <p className="mt-1.5 text-base font-semibold tracking-tight text-white">Academia</p>
      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">Sistema académico integral</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(251,191,36,0.65)]" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">{badgeLabel}</span>
      </div>
    </div>
  )
}
