import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const SIDEBAR_COLLAPSED_KEY = 'wr_sidebar_collapsed'

function useDesktopNav() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 901px)').matches : true,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const onChange = () => setDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return desktop
}

/** Three groups: execution, protocol depth, day-to-day tools + tracking (fewer headings than six micro-sections). */
const NAV_GROUPS: { id: string; label: string; items: { to: string; label: string }[] }[] = [
  {
    id: 'workflow',
    label: 'Your workflow',
    items: [
      { to: '/start', label: 'Start Here' },
      { to: '/today', label: 'Today' },
      { to: '/plate', label: 'Plate System' },
      { to: '/daily', label: 'Daily Plan' },
      { to: '/coach', label: 'Coach' },
      { to: '/swaps', label: 'Food Swaps' },
      { to: '/foods', label: 'Food Database' },
      { to: '/meals', label: 'Meal Builder' },
    ],
  },
  {
    id: 'protocol',
    label: 'Protocol & science',
    items: [
      { to: '/overview', label: 'Overview' },
      { to: '/numbers', label: 'Your Numbers' },
      { to: '/phases', label: 'Phases' },
      { to: '/rules', label: 'Rules' },
      { to: '/safety', label: 'Safety' },
      { to: '/biomarkers', label: 'Biomarkers' },
      { to: '/synergies', label: 'Synergies' },
      { to: '/support', label: 'Support Stack' },
    ],
  },
  {
    id: 'living',
    label: 'Living & tracking',
    items: [
      { to: '/supplements', label: 'Supplements' },
      { to: '/eatingout', label: 'Eating Out' },
      { to: '/shopping', label: 'Shopping List' },
      { to: '/resources', label: 'Resources' },
      { to: '/troubleshoot', label: 'Troubleshoot' },
      { to: '/review', label: 'Weekly Review' },
      { to: '/progress', label: 'My Progress' },
    ],
  },
]

export function AppShell() {
  const desktopNav = useDesktopNav()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
  })

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? '1' : '0')
  }, [sidebarCollapsed])

  useEffect(() => {
    if (desktopNav) setSidebarOpen(false)
  }, [desktopNav])

  const sidebarHiddenFromAt = desktopNav && sidebarCollapsed

  return (
    <>
      <header className="appbar">
        <div className="appbar-start">
          <button
            type="button"
            className="menu-toggle"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden focusable="false">
              <path
                fill="currentColor"
                d="M4 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="sidebar-rail-toggle"
            aria-label={sidebarCollapsed ? 'Expand guide sidebar' : 'Collapse guide sidebar'}
            aria-expanded={!sidebarCollapsed}
            aria-controls="sidebar"
            onClick={() => setSidebarCollapsed((c) => !c)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
              {sidebarCollapsed ? (
                <path
                  fill="currentColor"
                  d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                />
              )}
            </svg>
          </button>
          <div className="appbar-identity">
            <span className="appbar-product">The Waist Reset</span>
            <span className="appbar-identity-gap" aria-hidden />
            <div className="appbar-brand">
              <span className="lacbis">LACBIS</span>
              <span className="descriptor">Medical</span>
            </div>
          </div>
        </div>
        <div className="appbar-spacer" />
        <div className="appbar-end">
          <span
            className="appbar-chip"
            role="status"
            title="Built with React. Caches key content so the guide stays usable without a network once loaded."
          >
            <span className="appbar-chip-dot" aria-hidden />
            Offline-ready
          </span>
        </div>
      </header>

      <div className={`app${sidebarCollapsed ? ' app--sidebar-collapsed' : ''}`}>
        <aside
          className={`sidebar${sidebarOpen ? ' open' : ''}`}
          id="sidebar"
          aria-hidden={sidebarHiddenFromAt ? true : undefined}
        >
          <nav className="nav nav--top" aria-label="Guide sections">
            {NAV_GROUPS.map((g) => (
              <section key={g.id} className="nav-group" aria-labelledby={`nav-h-${g.id}`}>
                <h2 className="nav-label" id={`nav-h-${g.id}`}>
                  {g.label}
                </h2>
                <div className="nav-items">
                  {g.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </section>
            ))}
          </nav>
          <div className="sidebar-footer">
            <p className="sidebar-footer-grades" title="Evidence grades used in the guide">
              <strong className="g-a">A</strong> RCT/meta · <strong className="g-bp">B+</strong> cohort ·{' '}
              <strong className="g-b">B</strong> prelim · <strong className="g-cp">C+</strong> mech
            </p>
          </div>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  )
}
