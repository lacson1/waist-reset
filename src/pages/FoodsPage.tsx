import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFoods } from '../domain/foods'
import type { FoodRow } from '../domain/foods'
import { FoodTypeIcon } from '../components/plate/FoodTypeIcon'
import { foodTypeKind } from '../components/plate/foodTypeMeta'
import { useUserFoodsStore } from '../store/userFoodsStore'

export type { FoodRow }

export function FoodsPage() {
  const { raw, err, loading } = useFoods()
  const userEntries = useUserFoodsStore((s) => s.entries)
  const addUserFood = useUserFoodsStore((s) => s.addEntry)
  const removeUserFood = useUserFoodsStore((s) => s.removeEntry)

  const [ufName, setUfName] = useState('')
  const [ufQty, setUfQty] = useState('100 g')
  const [ufBranch, setUfBranch] = useState<'General' | 'African'>('General')
  const [ufKcal, setUfKcal] = useState('')
  const [ufP, setUfP] = useState('')
  const [ufF, setUfF] = useState('')
  const [ufC, setUfC] = useState('')
  const [q, setQ] = useState('')
  const [branch, setBranch] = useState<'all' | 'General' | 'African'>('all')
  const [type, setType] = useState<string>('all')
  const [sortKey, setSortKey] = useState<'n' | 'kcal' | 'p'>('n')

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

  const saveUserFood = () => {
    const kcal = parseFloat(ufKcal)
    const p = parseFloat(ufP)
    const f = parseFloat(ufF)
    const c = parseFloat(ufC)
    if (!ufName.trim()) {
      window.alert('Enter a food name.')
      return
    }
    if (!Number.isFinite(kcal) || !Number.isFinite(p) || !Number.isFinite(f) || !Number.isFinite(c)) {
      window.alert('Enter kcal and macros (P / F / C) as numbers.')
      return
    }
    const row: FoodRow = {
      n: ufName.trim(),
      b: ufBranch,
      t: 'Custom',
      qty: ufQty.trim() || '100 g',
      kcal,
      p,
      f,
      c,
    }
    addUserFood(row)
    setUfName('')
    setUfKcal('')
    setUfP('')
    setUfF('')
    setUfC('')
  }

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Reference</div>
          <h1>Food database</h1>
          <div className="topbar-sub">
            Ported list from the legacy dashboard. Use with <Link to="/plate">Plate system</Link>. Add your own rows
            below — they appear in the plate search and in full app backups.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Your foods</div>
        <p className="food-count muted" style={{ marginBottom: '1rem' }}>
          Saved on this device only. Included when you use <strong>Full app backup</strong> on{' '}
          <Link to="/progress">My Progress</Link>.
        </p>
        <div className="food-toolbar" style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="food-filters" style={{ flexWrap: 'wrap' }}>
            <label className="field food-field-grow">
              <span>Name</span>
              <input value={ufName} onChange={(e) => setUfName(e.target.value)} placeholder="e.g. Homemade stew" />
            </label>
            <label className="field">
              <span>Serving</span>
              <input value={ufQty} onChange={(e) => setUfQty(e.target.value)} placeholder="100 g" />
            </label>
            <label className="field">
              <span>Branch</span>
              <select value={ufBranch} onChange={(e) => setUfBranch(e.target.value as typeof ufBranch)}>
                <option value="General">General</option>
                <option value="African">African</option>
              </select>
            </label>
            <label className="field">
              <span>Kcal</span>
              <input value={ufKcal} onChange={(e) => setUfKcal(e.target.value)} inputMode="decimal" />
            </label>
            <label className="field">
              <span>P</span>
              <input value={ufP} onChange={(e) => setUfP(e.target.value)} inputMode="decimal" />
            </label>
            <label className="field">
              <span>F</span>
              <input value={ufF} onChange={(e) => setUfF(e.target.value)} inputMode="decimal" />
            </label>
            <label className="field">
              <span>C</span>
              <input value={ufC} onChange={(e) => setUfC(e.target.value)} inputMode="decimal" />
            </label>
            <div className="field" style={{ alignSelf: 'flex-end' }}>
              <button type="button" className="btn btn-sm" onClick={saveUserFood}>
                Add to my foods
              </button>
            </div>
          </div>
        </div>
        {userEntries.length === 0 ? (
          <p className="muted">No custom foods yet.</p>
        ) : (
          <ul className="user-foods-list" style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
            {userEntries.map((e) => (
              <li
                key={e.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem 1rem',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--hairline, #e8e4dc)',
                }}
              >
                <strong>{e.row.n}</strong>
                <span className="muted">
                  {e.row.qty} · P{e.row.p} F{e.row.f} C{e.row.c} · {e.row.kcal} kcal · {e.row.b}
                </span>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => removeUserFood(e.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
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
          {loading ? 'Loading…' : err ? err : `${rows.length} shown (${raw?.length ?? 0} total)`}
        </p>
      </div>

      <div className="food-card-grid">
        {rows.map((f) => (
          <article key={`${f.n}-${f.qty}`} className="food-card">
            <div className="food-card-top">
              <div className="food-card-title">
                <FoodTypeIcon kind={foodTypeKind(f.t)} size="md" />
                <h3>{f.n}</h3>
              </div>
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
