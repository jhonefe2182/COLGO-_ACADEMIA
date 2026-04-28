import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar, getNavItems } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { getSearchSuggestionsFromData } from '../services/mockData'
import { useColgo } from '../state/useColgo'
import { loadSessionUser } from '../state/authSession'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const { students, payments, courses, locations } = useColgo()

  const suggestions = useMemo(
    () => getSearchSuggestionsFromData({ students, courses, payments, locations }),
    [students, courses, payments, locations],
  )

  const rol = loadSessionUser()?.rol
  const cambiarPasswordPendiente = Boolean(loadSessionUser()?.cambiar_password)
  const navItems = useMemo(() => getNavItems(rol), [rol])

  const activePageLabel = useMemo(() => {
    const active = navItems.find((item) => location.pathname.startsWith(item.to))
    return active?.label ?? 'Panel'
  }, [location.pathname, navItems])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-72">
        <Header
          onOpenSidebar={() => setMobileOpen(true)}
          suggestions={suggestions}
          activePageLabel={activePageLabel}
        />

        <main className="px-4 pb-6 pt-4 lg:px-6 lg:pb-8">
          {cambiarPasswordPendiente ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Recomendación de seguridad: actualiza tu contraseña inicial desde tu perfil/configuración.
            </div>
          ) : null}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

