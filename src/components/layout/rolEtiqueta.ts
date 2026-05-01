import type { UserRole } from '../../state/authSession'

/** Etiqueta del modo de interfaz (misma lógica en sidebar, ficha y cabeceras). */
export function rolEtiqueta(rol?: UserRole): string {
  if (rol === 'admin') return 'Administración'
  if (rol === 'staff') return 'Staff'
  if (rol === 'docente') return 'Docencia'
  if (rol === 'estudiante') return 'Estudiante'
  return 'Usuario'
}
