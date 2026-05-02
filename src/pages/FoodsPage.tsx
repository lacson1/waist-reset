import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export interface FoodRow {
  n: string
  b: string
  t: string
  r?: string
  qty: string
  kcal: number
  p: number
  f: number
  c: number
  g?: string
  mech?: string
  ev?: string
  prep?: string
}

export function FoodsPage() {
  const [raw, setRaw] = useState<FoodRow[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [branch, setBranch] = useState<'all' | 'General' | 'African'>('all')
  const [type, setType] = useState<string>('all')
  const [sortKey, setSortKey] = useState<'n' | 'kcal' | 'p'>('n')

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}foods.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<FoodRow[]>
      })
      .then((data) => {
        if (!cancelled) setRaw(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setErr('Could not load foods.json')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const types = useMemo(() => {
    if (!raw) return [] as string[]
    const s = new Set<string>()
    raw.forEach((f) => s.add(f.t))
    return [...s].sort()
  }, [raw])

  const rows = useMemo(() => {
    if (!raw) return []
    let list = raw.filter((f) => {
      if (branch !== 'all' && f.b !== branch) return false
      if (type !== 'all' && f.t !== type) return false
      if (q.trim()) {
        const qq = q.trim().toLowerCase()
        const blob = `${f.n} ${f.mech ?? ''} ${f.ev ?? ''} ${f.prep ?? ''}`.toLowerCase()
        if (!blob.includes(qq)) return false
      }
      return true
    })
    list = [...list].sort((a, b) => {
      if (sortKey === 'kcal') return a.kcal - b.kcal
      if (sortKey === 'p') return b.p - a.p
      return a.n.localeCompare(b.n)
    })
    return list
  }, [raw, branch, type, q, sortKey])

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Reference</div>
          <h1>Food database</h1>
          <div className="topbar-sub">
            Ported list from the legacy dashboard. Use with <Link to="/plate">Plate system</Link>. Sorting works on a
            copy of the filtered list (source array is never mutated).
          </div>
        </div>
      </div>

      <div className="card food-toolbar">
        <div className="food-filters">
          <label className="field food-field-grow">
            <span>Search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, mechanism, prep…" />
          </label>
          <label className="field">
            <span>Branch</span>
            <select value={branch} onChange={(e) => setBranch(e.target.value as typeof branch)}>
              <option value="all">All</option>
              <option value="General">General</option>
              <option value="African">African</option>
            </select>
          </label>
          <label className="field">
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Sort</span>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as typeof sortKey)}>
              <option value="n">Name A–Z</option>
              <option value="kcal">Kcal (low → high)</option>
              <option value="p">Protein (high → low)</option>
            </select>
          </label>
        </div>
        <p className="food-count muted">
          {raw == null && !err ? 'Loading…' : err ? err : `${rows.length} shown (${raw?.length ?? 0} total)`}
        </p>
      </div>

      <div className="food-card-grid">
        {rows.map((f) => (
          <article key={`${f.n}-${f.qty}`} className="food-card">
            <div className="food-card-top">
              <h3>{f.n}</h3>
              {f.g && <span className="pill pill--teal">{f.g}</span>}
            </div>
            <div className="food-meta">
              <span>{f.b}</span>
              <span>·</span>
              <span>{f.t}</span>
              {f.r ? (
                <>
                  <span>·</span>
                  <span>{f.r}</span>
                </>
              ) : null}
            </div>
            <div className="food-macros">
              {f.qty} · P{f.p} · F{f.f} · C{f.c} · {f.kcal} kcal
            </div>
            {f.mech && <p className="food-mech">{f.mech}</p>}
            {f.ev && <p className="food-ev">{f.ev}</p>}
            {f.prep && <p className="food-prep">Prep: {f.prep}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}
