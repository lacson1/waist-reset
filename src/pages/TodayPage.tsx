import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgressStore, mergeTodayChecklist, quickLogToday } from '../store/progressStore'
import { computePersonal, currentPhase, greetingText, phaseKcal, phaseKcalNote } from '../domain/personalisation'
import { buildRecommendations, DEFAULT_CHECKLIST_ITEMS } from '../domain/coach'
import { computeNextActions, fastStatus } from '../domain/todayActions'
import { TodayMealsCard } from '../components/today/TodayMealsCard'

export function TodayPage() {
  const baseline = useProgressStore((s) => s.baseline)
  const entries = useProgressStore((s) => s.entries)
  const [, tick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 60000)
    return () => clearInterval(id)
  }, [])

  const phase = useMemo(() => currentPhase(baseline), [baseline])
  const personal = useMemo(() => computePersonal(baseline), [baseline])
  const kcal = phaseKcal(phase, baseline)
  const kcalNote = phaseKcalNote(phase)
  const next = useMemo(() => computeNextActions(phase, baseline), [phase, baseline])
  const fast = fastStatus()
  const coachPreview = useMemo(
    () => buildRecommendations({ baseline, entries }).slice(0, 2),
    [baseline, entries],
  )

  const today = new Date().toISOString().slice(0, 10)
  const todayEntry = entries.find((e) => e.date === today)
  const checklist = todayEntry?.checklist
  const checklistKey = `${today}|${JSON.stringify(checklist ?? null)}`

  const [localChecks, setLocalChecks] = useState<Record<string, boolean>>({})
  useEffect(() => {
    const init: Record<string, boolean> = {}
    DEFAULT_CHECKLIST_ITEMS.forEach((i) => {
      init[i.key] = !!(checklist && checklist[i.key as keyof typeof checklist])
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when calendar day or stored checklist changes
    setLocalChecks(init)
    // checklistKey encodes `checklist` JSON; omit object identity from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps -- checklistKey is the stable sync signal
  }, [checklistKey])

  const checkedCount = DEFAULT_CHECKLIST_ITEMS.filter((i) => localChecks[i.key]).length
  const adhPct = DEFAULT_CHECKLIST_ITEMS.length
    ? Math.round((checkedCount / DEFAULT_CHECKLIST_ITEMS.length) * 100)
    : 0

  const phasePct = Math.min(100, (phase.totalDays / 126) * 100)

  const positionText =
    phase.num === 0
      ? 'Set your start date on the Progress tab to start the clock.'
      : phase.num === 4
        ? 'Protocol complete. Maintenance mode — hold deficit at 0–10% and keep logging waist monthly.'
        : `Week ${phase.week} · Day ${phase.dayInPhase + 1} of Phase ${phase.num} (${phase.name}) · ${phase.weeksLeft ?? 0} weeks until next phase.`

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Today</div>
          <h1 id="today-greeting">{greetingText()}</h1>
          <div className="topbar-sub">
            Your personalised plan, adherence checklist, and quick-log in one place.
          </div>
        </div>
        <div className="topbar-right">
          <span className="chip teal">Phase {phase.num || 0} · {phase.name}</span>
          <span className="chip gold">Day {phase.totalDays + 1} of 126</span>
        </div>
      </div>

      <div className="kpi-grid today-kpis">
        <div className="kpi teal">
          <div className="kpi-label">Calories today</div>
          <div className="kpi-value">{kcal ? `${kcal} kcal` : '—'}</div>
          <div className="kpi-sub">{kcal ? kcalNote : <Link to="/progress">Set baseline</Link>}</div>
        </div>
        <div className="kpi clay">
          <div className="kpi-label">Protein target</div>
          <div className="kpi-value">{personal.protein ? `${personal.protein} g` : '—'}</div>
          <div className="kpi-sub">
            {personal.protein
              ? `≈ ${Math.round(personal.protein / 4)} g × 4 meals`
              : <Link to="/progress">Set baseline</Link>}
          </div>
        </div>
        <div className="kpi gold">
          <div className="kpi-label">Fast / feed</div>
          <div className="kpi-value">{fast.label}</div>
          <div className="kpi-sub">{fast.sub}</div>
        </div>
      </div>

      <div className="stitch-section__head" style={{ marginTop: 8 }}>
        <h2>Today&apos;s playbook</h2>
        <p>
          Use your numbers above, then model mains on the plate. Match timing to{' '}
          <Link to="/daily">Daily plan</Link> when helpful — phase kcal and protein targets are the protocol truth.
        </p>
      </div>
      <div className="feature-grid" style={{ marginBottom: 20 }}>
        {[
          { to: '/plate', title: 'Plate system', body: 'Rest / training / soup templates', d: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Zm9-9v18M3 12h18' },
          { to: '/daily', title: 'Daily structure', body: 'Example clock for General vs African emphasis', d: 'M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
          { to: '/swaps', title: 'Food swaps', body: 'High-impact substitutions by category', d: 'M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4' },
          { to: '/meals', title: 'Meal builder', body: 'Meal-order rules + links to tools', d: 'M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8' },
          { to: '/coach', title: 'Coach', body: 'Risk, adherence, and waist trends', d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' },
          { to: '/progress', title: 'My Progress', body: 'Baseline, labs on entries, charts', d: 'M3 3v18h18M7 14l4-4 4 4 5-5' },
        ].map((t) => (
          <Link key={t.to} className="feature-card" to={t.to}>
            <span className="feature-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={t.d} />
              </svg>
            </span>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
          </Link>
        ))}
      </div>
      {coachPreview.length > 0 && (
        <div className="card playbook-card">
          <div className="playbook-coach-preview">
            <div className="playbook-coach-label">Top signals from Coach</div>
            <ul className="playbook-coach-list">
              {coachPreview.map((r, i) => (
                <li key={`${r.head}-${i}`}>
                  <span className={`playbook-coach-sev playbook-coach-sev--${r.level}`}>{r.level}</span>
                  <span className="playbook-coach-head">{r.head}</span>
                </li>
              ))}
            </ul>
            <Link to="/coach" className="playbook-coach-more">
              Open Coach for full detail and trace
            </Link>
          </div>
        </div>
      )}

      <div className="card">
        <div className="section-title">Phase map</div>
        <div className="phase-bar-wrap">
          <div className="phase-bar">
            <div className="phase-bar-fill" style={{ width: `${phasePct}%` }} />
          </div>
          <div className="phase-markers">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={`phase-marker${phase.num > n || phase.num === 4 ? ' done' : ''}${phase.num === n || (n === 4 && phase.num === 4) ? ' active' : ''}`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
        <p className="phase-position">{positionText}</p>
      </div>

      <div className="card">
        <div className="section-title">Next actions</div>
        <div className="next-list">
          {next.map((a) => (
            <div key={a.time + a.title} className="next-action">
              <div className="next-time">{a.time}</div>
              <div className="next-body">
                <div className="next-title">{a.title}</div>
                <div className="next-detail">{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TodayMealsCard />

      <div className="card">
        <div className="section-title">Today&apos;s protocol</div>
        <div className="checklist" id="today-checklist">
          {DEFAULT_CHECKLIST_ITEMS.map((i) => (
            <label key={i.key} className="check-item">
              <input
                type="checkbox"
                data-key={i.key}
                checked={!!localChecks[i.key]}
                onChange={(e) => setLocalChecks((p) => ({ ...p, [i.key]: e.target.checked }))}
              />
              <span>{i.label}</span>
            </label>
          ))}
        </div>
        <div className="today-adh-row">
          <span className="adh-label">Adherence</span>
          <span id="today-adh-pct" className="adh-pct">{adhPct}%</span>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          id="save-today-checklist"
          onClick={() => {
            mergeTodayChecklist(localChecks, adhPct)
            window.alert(`Saved today's adherence: ${adhPct}%`)
          }}
        >
          Save as today&apos;s adherence
        </button>
      </div>

      <div className="card">
        <h3 className="section-h">Quick log</h3>
        <div className="form-sub">Fast entry — weight and waist for today.</div>
        <div className="input-row">
          <div className="field">
            <label htmlFor="q-weight">Weight (kg)</label>
            <input id="q-weight" type="number" step={0.1} />
          </div>
          <div className="field">
            <label htmlFor="q-waist">Waist (cm)</label>
            <input id="q-waist" type="number" step={0.1} />
          </div>
          <div className="field" style={{ alignSelf: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-sm"
              id="q-log"
              onClick={() => {
                const w = parseFloat((document.getElementById('q-weight') as HTMLInputElement)?.value || '')
                const wa = parseFloat((document.getElementById('q-waist') as HTMLInputElement)?.value || '')
                if (Number.isNaN(w) && Number.isNaN(wa)) {
                  window.alert('Enter at least weight or waist.')
                  return
                }
                quickLogToday(Number.isNaN(w) ? null : w, Number.isNaN(wa) ? null : wa)
                ;(document.getElementById('q-weight') as HTMLInputElement).value = ''
                ;(document.getElementById('q-waist') as HTMLInputElement).value = ''
                window.alert(`Logged for ${today}`)
              }}
            >
              Log today
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
