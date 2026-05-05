import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FOOD_SWAP_CATEGORIES,
  FOOD_SWAPS_INTRO,
  TOP_TEN_SWAPS,
  WHY_FOOD_SWAPS,
  type FoodSwapAccent,
  type FoodSwapRow,
  type SwapImpact,
} from '../data/foodSwapsContent'

function ImpactBadge({ impact }: { impact: SwapImpact }) {
  const filled = impact === 'High' ? 3 : impact === 'Medium' ? 2 : 1
  const cls =
    impact === 'High'
      ? 'swap-impact swap-impact--high'
      : impact === 'Medium'
        ? 'swap-impact swap-impact--medium'
        : 'swap-impact swap-impact--low'
  return (
    <span className={cls}>
      <span className="swap-impact__meter" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={`swap-impact__seg${i <= filled ? ' swap-impact__seg--on' : ''}`} />
        ))}
      </span>
      {impact}
    </span>
  )
}

function SwapArrowTitle({ title }: { title: string }) {
  const parts = title.split(' → ')
  if (parts.length >= 2) {
    const from = parts[0]
    const to = parts.slice(1).join(' → ')
    return (
      <div className="food-swaps-arrow-title">
        <span className="food-swaps-arrow-title__pill food-swaps-arrow-title__pill--from">{from}</span>
        <span className="food-swaps-arrow-title__arrow" aria-hidden>
          <svg className="food-swaps-arrow-title__svg" viewBox="0 0 32 12" width="32" height="12">
            <path
              d="M0 6h24M20 1l6 5-6 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="food-swaps-arrow-title__pill food-swaps-arrow-title__pill--to">{to}</span>
      </div>
    )
  }
  return <div className="food-swaps-arrow-title food-swaps-arrow-title--single">{title}</div>
}

function CategoryGlyph({ id }: { id: string }) {
  const stroke = 'currentColor'
  const common = { fill: 'none', stroke, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (id) {
    case 'drinks':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path {...common} d="M7 3h10l-1 18a2 2 0 0 1-2 1.8H10a2 2 0 0 1-2-1.8L7 3zM9 7h6" />
        </svg>
      )
    case 'refined-carbs':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <circle {...common} cx="12" cy="12" r="7" />
          <path {...common} d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'breakfast':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path {...common} d="M4 10c0-3 3.5-6 8-6s8 3 8 6v2H4v-2zM6 14h12v6H6v-6z" />
        </svg>
      )
    case 'snacks':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <rect {...common} x="5" y="8" width="14" height="10" rx="2" />
          <path {...common} d="M8 8V6a4 4 0 0 1 8 0v2" />
        </svg>
      )
    case 'oils':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path {...common} d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11z" />
          <path {...common} d="M12 14v5" />
        </svg>
      )
    case 'sauces':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path {...common} d="M12 3v6M8 9h8l-1 12H9L8 9z" />
          <circle {...common} cx="12" cy="5" r="1.2" />
        </svg>
      )
    case 'takeaway':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path {...common} d="M4 10h16v10H4V10zM8 10V7a4 4 0 0 1 8 0v3" />
          <path {...common} d="M9 14h6" />
        </svg>
      )
    case 'desserts':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path {...common} d="M12 4l1.5 4h4l-3.2 2.4 1.2 4L12 14l-3.5 2.4 1.2-4L7 8h4L12 4z" />
        </svg>
      )
    case 'african-staples':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path {...common} d="M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10z" />
          <path {...common} d="M12 11v6M9 14h6" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <circle {...common} cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

function SwapRowCard({ row, accent }: { row: FoodSwapRow; accent: FoodSwapAccent }) {
  return (
    <article className={`food-swaps-swap-card food-swaps-swap-card--accent-${accent}`}>
      <div className="food-swaps-swap-card__impact">
        <ImpactBadge impact={row.impact} />
      </div>
      <div className="food-swaps-swap-card__pair">
        <div className="food-swaps-swap-col">
          <span className="food-swaps-swap-label">Instead of</span>
          <p className="food-swaps-swap-text">{row.instead}</p>
        </div>
        <div className="food-swaps-swap-arrow" aria-hidden>
          <svg className="food-swaps-swap-arrow__svg" viewBox="0 0 28 12" width="28" height="12">
            <path
              d="M0 6h20M16 1l6 5-6 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.85"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="food-swaps-swap-col food-swaps-swap-col--to">
          <span className="food-swaps-swap-label">Try</span>
          <p className="food-swaps-swap-text">{row.try}</p>
        </div>
      </div>
      <div className="food-swaps-swap-why">
        <span className="food-swaps-swap-why-label">Why it works</span>
        {row.why}
      </div>
    </article>
  )
}

type FoodSwapsMainTab = 'top-ten' | 'why' | (typeof FOOD_SWAP_CATEGORIES)[number]['id']

function hashToTab(hash: string): FoodSwapsMainTab | null {
  if (hash === 'section-top-ten') return 'top-ten'
  if (hash === 'section-why') return 'why'
  if (hash.startsWith('cat-')) {
    const id = hash.slice(4)
    if (FOOD_SWAP_CATEGORIES.some((c) => c.id === id)) return id as FoodSwapsMainTab
  }
  return null
}

function tabToHash(tab: FoodSwapsMainTab): string {
  if (tab === 'top-ten') return 'section-top-ten'
  if (tab === 'why') return 'section-why'
  return `cat-${tab}`
}

function shortCategoryTitle(title: string) {
  return title.replace(' (extended)', '')
}

export function FoodSwapsPage() {
  const defaultTab: FoodSwapsMainTab = 'top-ten'
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<FoodSwapsMainTab>(() => {
    if (typeof window === 'undefined') return defaultTab
    return hashToTab(window.location.hash.slice(1)) ?? defaultTab
  })

  const selectTab = useCallback((tab: FoodSwapsMainTab) => {
    setActiveTab(tab)
    const hash = tabToHash(tab)
    window.history.replaceState(null, '', `#${hash}`)
  }, [])

  useEffect(() => {
    const fromUrl = location.hash.slice(1)
    if (!fromUrl) return
    const next = hashToTab(fromUrl)
    if (next) setActiveTab(next)
  }, [location.hash])

  useEffect(() => {
    const onHash = () => {
      const next = hashToTab(window.location.hash.slice(1))
      if (next) setActiveTab(next)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <section className="view active food-swaps-page">
      <div className="food-swaps-page__inner">
        <header className="food-swaps-hero">
          <div className="food-swaps-hero__mesh" aria-hidden />
          <div className="food-swaps-hero__glow" aria-hidden />
          <div className="food-swaps-hero__frame" />
          <div className="topbar food-swaps-hero__topbar">
            <div className="topbar-left">
              <div className="eyebrow">{FOOD_SWAPS_INTRO.eyebrow}</div>
              <h1 className="food-swaps-hero__title">{FOOD_SWAPS_INTRO.title}</h1>
              <div className="topbar-sub food-swaps-hero__lead">{FOOD_SWAPS_INTRO.lead}</div>
              <div className="food-swaps-meta-row">
                {FOOD_SWAPS_INTRO.chips.map((c) => (
                  <span key={c} className="food-swaps-chip">
                    {c}
                  </span>
                ))}
              </div>
              <p className="food-swaps-hero__plate">
                <Link to="/plate" className="food-swaps-hero__plate-link">
                  Open plate templates
                </Link>
                <span className="food-swaps-hero__plate-note"> — same protocol, portioned visually</span>
              </p>
            </div>
          </div>
        </header>

        <div className="food-swaps-tabs-shell">
          <div className="food-swaps-tabs-ribbon">
            <span className="food-swaps-tabs-ribbon__label">Sections</span>
            <p className="food-swaps-tabs-ribbon__hint">
              Tabs update the URL so you can bookmark or share a category.
            </p>
          </div>
          <div className="food-swaps-tablist-wrap">
            <div className="food-swaps-tablist-scroll" role="presentation">
              <div
                className="food-swaps-tablist"
                role="tablist"
                aria-label="Food swap sections"
              >
                <button
                  type="button"
                  role="tab"
                  id="food-swaps-tab-top-ten"
                  className={`food-swaps-tab${activeTab === 'top-ten' ? ' food-swaps-tab--active' : ''}`}
                  aria-selected={activeTab === 'top-ten' ? 'true' : 'false'}
                  onClick={() => selectTab('top-ten')}
                >
                  Top 10
                </button>
                {FOOD_SWAP_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`food-swaps-tab-${c.id}`}
                    className={`food-swaps-tab${activeTab === c.id ? ' food-swaps-tab--active' : ''}`}
                    aria-selected={activeTab === c.id ? 'true' : 'false'}
                    onClick={() => selectTab(c.id)}
                  >
                    {shortCategoryTitle(c.title)}
                  </button>
                ))}
                <button
                  type="button"
                  role="tab"
                  id="food-swaps-tab-why"
                  className={`food-swaps-tab${activeTab === 'why' ? ' food-swaps-tab--active' : ''}`}
                  aria-selected={activeTab === 'why' ? 'true' : 'false'}
                  onClick={() => selectTab('why')}
                >
                  Why swaps
                </button>
              </div>
            </div>
          </div>

          <div className="food-swaps-tabpanels">
          <div
            role="tabpanel"
            id="food-swaps-panel-top-ten"
            aria-labelledby="food-swaps-tab-top-ten"
            hidden={activeTab !== 'top-ten'}
          >
            <div className="card food-swaps-top-ten food-swaps-top-ten--in-tabs" id="section-top-ten">
              <div className="food-swaps-section-head">
                <span className="food-swaps-section-kicker">Priority</span>
                <h2 className="section-h section-h--flush">If you do nothing else</h2>
              </div>
              <p className="food-swaps-section-lead">
                <strong>Top 10 highest-impact swaps</strong> — These ten changes account for most of the visceral-fat
                reduction in the first 8 weeks. Stack them progressively — don&apos;t try them all in week one.
              </p>
              <ol className="food-swaps-top-list">
                {TOP_TEN_SWAPS.map((s) => (
                  <li key={s.rank} className={`food-swaps-top-item${s.badge ? ' food-swaps-top-item--hero' : ''}`}>
                    <div className="food-swaps-top-rank" aria-hidden>
                      <span className="food-swaps-top-rank__circle">{s.rank}</span>
                      {s.badge && <span className="food-swaps-top-badge">{s.badge}</span>}
                    </div>
                    <div className="food-swaps-top-content">
                      <SwapArrowTitle title={s.title} />
                      <p className="food-swaps-top-body">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {FOOD_SWAP_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              role="tabpanel"
              id={`food-swaps-panel-${cat.id}`}
              aria-labelledby={`food-swaps-tab-${cat.id}`}
              hidden={activeTab !== cat.id}
            >
              <div
                className={`card food-swaps-category-card food-swaps-category-card--accent-${cat.accent}`}
                id={`cat-${cat.id}`}
              >
                <header className="food-swaps-cat-head">
                  <div className="food-swaps-cat-head__icon">
                    <CategoryGlyph id={cat.id} />
                  </div>
                  <div className="food-swaps-cat-head__text">
                    <h2 className="section-h section-h--flush">{cat.title}</h2>
                    {cat.lead && <p className="food-swaps-cat-lead">{cat.lead}</p>}
                  </div>
                </header>
                <div className="food-swaps-row-cards">
                  {cat.rows.map((row) => (
                    <SwapRowCard key={`${cat.id}-${row.instead}`} row={row} accent={cat.accent} />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div
            role="tabpanel"
            id="food-swaps-panel-why"
            aria-labelledby="food-swaps-tab-why"
            hidden={activeTab !== 'why'}
          >
            <div className="card food-swaps-why food-swaps-why--in-tabs" id="section-why">
              <div className="food-swaps-section-head">
                <span className="food-swaps-section-kicker">Mindset</span>
                <h2 className="section-h section-h--flush">{WHY_FOOD_SWAPS.title}</h2>
              </div>
              <div className="food-swaps-pillar-grid">
                {WHY_FOOD_SWAPS.pillars.map((p, i) => (
                  <div key={p.subtitle} className="food-swaps-pillar">
                    <span className="food-swaps-pillar__step">{i + 1}</span>
                    <h3>{p.subtitle}</h3>
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
              <p className="food-swaps-rule">{WHY_FOOD_SWAPS.rule}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
