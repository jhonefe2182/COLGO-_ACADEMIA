import { Outlet } from 'react-router-dom'

type Portal = 'admin' | 'staff'

type Props = {
  portal: Portal
}

export default function MiembroFichaLayout({ portal: _portal }: Props) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Misma esquina superior izquierda que el panel con sidebar: sin hueco arriba/izquierda en desktop */}
      <main className="w-full px-0 pb-12 pt-0 lg:pr-6 lg:pb-12">
        <Outlet />
      </main>
    </div>
  )
}
