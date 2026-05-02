import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const NAV_GROUPS: { id: string; label: string; items: { to: string; label: string }[] }[] = [
  {
    id: 'orient',
    label: 'Get oriented',
    items: [
      { to: '/start', label: 'Start Here' },
      { to: '/plate', label: 'Plate System' },
      { to: '/swaps', label: 'Food Swaps' },
    ],
  },
  {
    id: 'day',
    label: 'Your day',
    items: [
      { to: '/today', label: 'Today' },
      { to: '/daily', label: 'Daily Plan' },
      { to: '/coach', label: 'Coach' },
      { to: '/meals', label: 'Meal Builder' },
    ],
  },
  {
    id: 'plan',
    label: 'The plan',
    items: [
      { to: '/overview', label: 'Overview' },
      { to: '/numbers', label: 'Your Numbers' },
      { to: '/phases', label: 'Phases' },
      { to: '/rules', label: 'Rules' },
    ],
  },
  {
    id: 'guides',
    label: 'Practical guides',
    items: [
      { to: '/supplements', label: 'Supplements' },
      { to: '/eatingout', label: 'Eating Out' },
      { to: '/shopping', label: 'Shopping List' },
      { to: '/resources', label: 'Resources' },
      { to: '/troubleshoot', label: 'Troubleshoot' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    items: [
      { to: '/foods', label: 'Food Database' },
      { to: '/biomarkers', label: 'Biomarkers' },
      { to: '/synergies', label: 'Synergies' },
      { to: '/support', label: 'Support Stack' },
      { to: '/safety', label: 'Safety' },
    ],
  },
  {
    id: 'track',
    label: 'Tracking',
    items: [
      { to: '/review', label: 'Weekly Review' },
      { to: '/progress', label: 'My Progress' },
    ],
  },
]

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <header className="appbar">
        <button
          type="button"
          className="menu-toggle"
          aria-label="Menu"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          ☰
        </button>
        <div className="appbar-brand">
          <span className="lacbis">LACBIS</span>
          <span className="descriptor">Medical</span>
        </div>
        <div className="appbar-divider" />
        <div className="appbar-product">The Waist Reset</div>
        <div className="appbar-spacer" />
        <div className="appbar-meta">React · Offline-ready</div>
      </header>

      <div className="app">
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
          <div className="brand">
            <div className="brand-logo">
              <div className="brand-mark">VF</div>
              <div>
                <div className="brand-name">The Waist Reset</div>
                <div className="brand-sub">African-Mediterranean</div>
              </div>
            </div>
          </div>
          <nav className="nav" aria-label="Guide sections">
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
            <div className="sidebar-footer-title">Evidence grades</div>
            <p className="sidebar-footer-grades">
              <strong className="g-a">A</strong> RCT/Meta · <strong className="g-bp">B+</strong> Cohort ·{' '}
              <strong className="g-b">B</strong> Prelim · <strong className="g-cp">C+</strong> Mech
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
