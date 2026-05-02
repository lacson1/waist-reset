import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

/** Legacy HTML dashboard key for compatibility */
export const REVIEW_STORAGE_KEY = 'wr-reviews'

export interface WeeklyReview {
  id: string
  weekStart: string
  wins: string
  friction: string
  next: string
  savedAt: string
}

function loadReviews(): WeeklyReview[] {
  try {
    const raw = localStorage.getItem(REVIEW_STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter((x) => x && typeof x === 'object' && 'id' in x) as WeeklyReview[]
  } catch {
    return []
  }
}

function saveReviews(list: WeeklyReview[]) {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(list))
}

export function ReviewPage() {
  const [list, setList] = useState<WeeklyReview[]>(() => loadReviews())
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const mon = new Date(d.setDate(diff))
    return mon.toISOString().slice(0, 10)
  })
  const [wins, setWins] = useState('')
  const [friction, setFriction] = useState('')
  const [next, setNext] = useState('')

  const persist = useCallback((nextList: WeeklyReview[]) => {
    setList(nextList)
    saveReviews(nextList)
  }, [])

  const addReview = () => {
    if (!wins.trim() && !friction.trim() && !next.trim()) return
    const item: WeeklyReview = {
      id: crypto.randomUUID(),
      weekStart,
      wins: wins.trim(),
      friction: friction.trim(),
      next: next.trim(),
      savedAt: new Date().toISOString(),
    }
    persist([item, ...list])
    setWins('')
    setFriction('')
    setNext('')
  }

  const remove = (id: string) => {
    persist(list.filter((x) => x.id !== id))
  }

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Reflection</div>
          <h1>Weekly review</h1>
          <div className="topbar-sub">
            Short written check-in stored in this browser under <code>{REVIEW_STORAGE_KEY}</code> (same key as the
            legacy HTML tool). Pair with <Link to="/progress">My Progress</Link> for numbers.
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">New entry</h2>
        <div className="input-row">
          <div className="field">
            <label htmlFor="wk-start">Week starting (Monday)</label>
            <input id="wk-start" type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="wk-wins">Wins</label>
          <textarea id="wk-wins" rows={3} value={wins} onChange={(e) => setWins(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="wk-friction">Friction</label>
          <textarea id="wk-friction" rows={3} value={friction} onChange={(e) => setFriction(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="wk-next">Next week focus</label>
          <textarea id="wk-next" rows={2} value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={addReview}>
            Save review
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">History</h2>
        {list.length === 0 ? (
          <p className="muted">No saved reviews yet.</p>
        ) : (
          <ul className="review-history">
            {list.map((r) => (
              <li key={r.id} className="review-item">
                <div className="review-item-head">
                  <strong>Week of {r.weekStart}</strong>
                  <span className="muted">{new Date(r.savedAt).toLocaleString()}</span>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(r.id)}>
                    Remove
                  </button>
                </div>
                {r.wins && (
                  <p>
                    <em>Wins:</em> {r.wins}
                  </p>
                )}
                {r.friction && (
                  <p>
                    <em>Friction:</em> {r.friction}
                  </p>
                )}
                {r.next && (
                  <p>
                    <em>Next:</em> {r.next}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
