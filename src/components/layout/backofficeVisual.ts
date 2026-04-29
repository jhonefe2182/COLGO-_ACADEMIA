/**
 * Cromática y marco de cabeceras oscuras del panel (alineado con ficha de miembro).
 */

/** Marco exterior: mismo aspecto que tarjetas superiores de AdminMiembroPanelPage. */
export const backofficeDarkCardChrome =
  'overflow-hidden rounded-2xl border border-slate-700/25 shadow-xl ring-1 ring-black/5'

/** Degradado de superficie (COLGO ficha + cabecera de miembro + héroes de módulo). */
export const backofficeDarkSurfaceGradient =
  'bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/50'

/** Misma profundidad que la ficha (borde inferior interno suave). */
export const backofficeDarkSurfaceInset =
  'shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06)]'

/** Padding interno alineado: barra superior del layout + cabeceras de módulo. */
export const backofficeDarkInnerPad = 'px-4 py-3 sm:px-5 sm:py-3.5'

/** Línea inferior ámbar (misma que ColgoBrandBlock / ficha imagen 1). */
export const backofficeBottomAccentClass =
  'pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-90'

/** Halos decorativos compartidos (cabecera global + módulos). */
export const backofficeDarkOrbTopRight =
  'pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl'
export const backofficeDarkOrbBottomLeft =
  'pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-white/10 blur-2xl'

/** Para `<Button variant="secondary" className={backofficeHeroBtnOnDark} />` sobre cabecera oscura. */
export const backofficeHeroBtnOnDark = 'border-white/20 bg-white/10 text-white hover:bg-white/18 shadow-none'

/** Tarjeta de contenido alineada a la ficha (resumen / tablas). */
export const backofficePanelCardClass =
  'rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md'
