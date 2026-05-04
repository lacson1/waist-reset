import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FOOD_SWAP_CATEGORIES,
  FOOD_SWAPS_INTRO,
  TOP_TEN_SWAPS,
  WHY_FOOD_SWAPS,
  type FoodSwapAccent,
  type FoodSwapRow,
  type SwapImpact,
} from '../data/foodSwapsContent'
import { swapId, topSwapId, useSwapsStore } from '../store/swapsStore'

const ALL_IMPACTS: SwapImpact[] = ['High', 'Medium', 'Low']

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

function AdoptedToggle({ id, label }: { id: string; label?: string }) {
  const adopted = useSwapsStore((s) => s.adopted.includes(id))
  const toggle = useSwapsStore((s) => s.toggleAdopted)
  return (
    <button
      type="button"
      className={`food-swaps-adopted${adopted ? ' food-swaps-adopted--on' : ''}`}
      aria-pressed={adopted}
      onClick={() => toggle(id)}
      title={adopted ? 'Marked as adopted — click to remove' : 'Mark as adopted'}
    >
      <span className="food-swaps-adopted__check" aria-hidden>
        {adopted ? '✓' : ''}
      </span>
      {label ?? (adopted ? 'Adopted' : 'Mark adopted')}
    </button>
  )
}

function AddToShoppingButton({ item }: { item: string }) {
  const inList = useSwapsStore((s) => s.shoppingExtras.includes(item))
  const add = useSwapsStore((s) => s.addToShopping)
  const remove = useSwapsStore((s) => s.removeFromShopping)
  return (
    <button
      type="button"
      className={`food-swaps-shop-add${inList ? ' food-swaps-shop-add--on' : ''}`}
      aria-pressed={inList}
      onClick={() => (inList ? remove(item) : add(item))}
      title={inList ? 'Remove from shopping list' : 'Add to shopping list'}
    >
      {inList ? '✓ In shopping' : '+ Shopping'}
    </button>
  )
}

function SwapRowCard({
  row,
  accent,
  categoryId,
}: {
  row: FoodSwapRow
  accent: FoodSwapAccent
  categoryId: string
}) {
  const id = swapId(categoryId, row.instead)
  return (
    <article className={`food-swaps-swap-card food-swaps-swap-card--accent-${accent}`}>
      <div className="food-swaps-swap-card__head">
        <ImpactBadge impact={row.impact} />
        <div className="food-swaps-swap-card__actions">
          <AddToShoppingButton item={row.try} />
          <AdoptedToggle id={id} />
        </div>
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

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function rowMatches(row: FoodSwapRow, q: string) {
  if (!q) return true
  const hay = `${row.instead}\n${row.try}\n${row.why}`.toLowerCase()
  return hay.includes(q)
}

function topMatches(title: string, body: string, q: string) {
  if (!q) return true
  return `${title}\n${body}`.toLowerCase().includes(q)
}

export function FoodSwapsPage() {
  const [query, setQuery] = useState('')
  const [activeImpacts, setActiveImpacts] = useState<Set<SwapImpact>>(new Set())
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set())
  const adoptedCount = useSwapsStore((s) => s.adopted.length)
  const extrasCount = useSwapsStore((s) => s.shoppingExtras.length)

  const q = query.trim().toLowerCase()
  const impactsOn = activeImpacts.size > 0
  const catsOn = activeCats.size > 0

  const filteredCategories = useMemo(() => {
    return FOOD_SWAP_CATEGORIES.map((cat) => {
      if (catsOn && !activeCats.has(cat.id)) return { ...cat, rows: [] as FoodSwapRow[] }
      const rows = cat.rows.filter(
        (r) => (!impactsOn || activeImpacts.has(r.impact)) && rowMatches(r, q),
      )
      return { ...cat, rows }
    })
  }, [activeCats, activeImpacts, catsOn, impactsOn, q])

  const visibleCategoryCount = filteredCategories.filter((c) => c.rows.length > 0).length
  const totalRowCount = filteredCategories.reduce((n, c) => n + c.rows.length, 0)

  const filteredTopTen = useMemo(
    () => TOP_TEN_SWAPS.filter((t) => topMatches(t.title, t.body, q)),
    [q],
  )

  const showTopTen = !catsOn && !impactsOn && filteredTopTen.length > 0

  function toggleImpact(i: SwapImpact) {
    setActiveImpacts((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }
  function toggleCat(id: string) {
    setActiveCats((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function clearFilters() {
    setQuery('')
    setActiveImpacts(new Set())
    setActiveCats(new Set())
  }
  const filtersActive = !!q || impactsOn || catsOn

  return (
    <section className="view active food-swaps-page">
      <div className="food-swaps-hero">
        <div className="food-swaps-hero__mesh" aria-hidden />
        <div className="food-swaps-hero__glow" aria-hidden />
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
              <span className="food-swaps-meta-hint">
                Plate templates: <Link to="/plate">Plate system</Link>
              </span>
              <span className="food-swaps-meta-hint">
                {adoptedCount > 0 ? `${adoptedCount} adopted` : 'No swaps adopted yet'}
                {' · '}
                <Link to="/shopping">Shopping list</Link>
                {extrasCount > 0 ? ` (+${extrasCount})` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card food-swaps-filters" aria-label="Filter swaps">
        <div className="food-swaps-filters__row">
          <label className="food-swaps-search">
            <span className="food-swaps-search__icon" aria-hidden>
              <svg viewBox="0 0 20 20" width="16" height="16">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.75" />
                <path d="M14 14l4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search swaps (e.g. rice, sugar, breakfast)"
              aria-label="Search swaps"
            />
          </label>
          <div className="food-swaps-filter-group" role="group" aria-label="Impact">
            <span className="food-swaps-filter-label">Impact</span>
            {ALL_IMPACTS.map((i) => {
              const on = activeImpacts.has(i)
              return (
                <button
                  key={i}
                  type="button"
                  className={`food-swaps-filter-chip food-swaps-filter-chip--impact-${i.toLowerCase()}${on ? ' food-swaps-filter-chip--on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggleImpact(i)}
                >
                  {i}
                </button>
              )
            })}
          </div>
          {filtersActive && (
            <button type="button" className="food-swaps-filter-clear" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
        <div className="food-swaps-filter-group food-swaps-filter-group--cats" role="group" aria-label="Category">
          <span className="food-swaps-filter-label">Category</span>
          {FOOD_SWAP_CATEGORIES.map((c) => {
            const on = activeCats.has(c.id)
            return (
              <button
                key={c.id}
                type="button"
                className={`food-swaps-filter-chip food-swaps-filter-chip--cat food-swaps-filter-chip--accent-${c.accent}${on ? ' food-swaps-filter-chip--on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleCat(c.id)}
              >
                {c.title.replace(' (extended)', '')}
              </button>
            )
          })}
        </div>
        <div className="food-swaps-filter-summary" aria-live="polite">
          {filtersActive
            ? `Showing ${totalRowCount} swap${totalRowCount === 1 ? '' : 's'} across ${visibleCategoryCount} categor${
                visibleCategoryCount === 1 ? 'y' : 'ies'
              }${q ? ` matching “${query.trim()}”` : ''}.`
            : 'All swaps shown. Use search or chips to narrow down.'}
        </div>
      </div>

      <nav className="food-swaps-toc card" aria-label="On this page">
        <span className="food-swaps-toc-label">Jump to</span>
        <div className="food-swaps-toc-buttons">
          {showTopTen && (
            <button type="button" className="food-swaps-toc-btn" onClick={() => scrollToId('section-top-ten')}>
              Top 10
            </button>
          )}
          {filteredCategories
            .filter((c) => c.rows.length > 0)
            .map((c) => (
              <button key={c.id} type="button" className="food-swaps-toc-btn" onClick={() => scrollToId(`cat-${c.id}`)}>
                {c.title.replace(' (extended)', '')}
              </button>
            ))}
          <button type="button" className="food-swaps-toc-btn" onClick={() => scrollToId('section-why')}>
            Why swaps
          </button>
        </div>
      </nav>

      {showTopTen && (
        <div className="card food-swaps-top-ten" id="section-top-ten">
          <div className="food-swaps-section-head">
            <span className="food-swaps-section-kicker">Priority</span>
            <h2 className="section-h section-h--flush">If you do nothing else</h2>
          </div>
          <p className="food-swaps-section-lead">
            <strong>Top 10 highest-impact swaps</strong> — These ten changes account for most of the visceral-fat
            reduction in the first 8 weeks. Stack them progressively — don&apos;t try them all in week one.
          </p>
          <ol className="food-swaps-top-list">
            {filteredTopTen.map((s) => (
              <li key={s.rank} className={`food-swaps-top-item${s.badge ? ' food-swaps-top-item--hero' : ''}`}>
                <div className="food-swaps-top-rank" aria-hidden>
                  <span className="food-swaps-top-rank__circle">{s.rank}</span>
                  {s.badge && <span className="food-swaps-top-badge">{s.badge}</span>}
                </div>
                <div className="food-swaps-top-content">
                  <SwapArrowTitle title={s.title} />
                  <p className="food-swaps-top-body">{s.body}</p>
                  <div className="food-swaps-top-actions">
                    <AdoptedToggle id={topSwapId(s.rank)} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {filteredCategories.map((cat) =>
        cat.rows.length === 0 ? null : (
          <div
            key={cat.id}
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
                <SwapRowCard
                  key={`${cat.id}-${row.instead}`}
                  row={row}
                  accent={cat.accent}
                  categoryId={cat.id}
                />
              ))}
            </div>
          </div>
        ),
      )}

      {filtersActive && totalRowCount === 0 && !showTopTen && (
        <div className="card food-swaps-empty">
          <h2 className="section-h section-h--flush">No swaps match those filters</h2>
          <p>Try a different search term, broaden the impact selection, or clear the category chips.</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      )}

      <div className="card food-swaps-why" id="section-why">
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
    </section>
  )
}
