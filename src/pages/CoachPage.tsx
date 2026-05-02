import { useMemo, useState } from 'react'
import { useProgressStore } from '../store/progressStore'
import { buildMilestones, buildRecommendations, riskTier } from '../domain/coach'
import { TROUBLE_TREES } from '../domain/troubleTrees'
import { CoachCharts } from '../components/CoachCharts'

export function CoachPage() {
  const baseline = useProgressStore((s) => s.baseline)
  const entries = useProgressStore((s) => s.entries)
  const [troubleKey, setTroubleKey] = useState<string | null>(null)

  const state = useMemo(() => ({ baseline, entries }), [baseline, entries])
  const risk = useMemo(() => riskTier(baseline, entries), [baseline, entries])
  const recs = useMemo(() => buildRecommendations(state), [state])
  const miles = useMemo(() => buildMilestones(state), [state])

  const trouble = troubleKey ? TROUBLE_TREES[troubleKey] : null

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Adaptive Feedback</div>
          <h1>Coach</h1>
          <div className="topbar-sub">
            Signals from your logs translated into protocol adjustments. The more you log, the sharper this gets.
          </div>
        </div>
        <div className="topbar-right">
          <span className="chip teal">{recs.length} signal{recs.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Risk Stratification</div>
        <div className="section-h">Your metabolic risk profile</div>
        <div className="risk-tier">
          {(['low', 'mod', 'high'] as const).map((k) => {
            const label = k === 'low' ? 'Low Risk' : k === 'mod' ? 'Moderate Risk' : 'High Risk'
            return (
              <span key={k} className={`risk-badge${risk.tier === k ? ` active ${k}` : ''}`}>
                {label}
              </span>
            )
          })}
        </div>
        <div className="risk-details">
          {risk.rows.length === 0 ? (
            <div className="risk-empty">Add sex, waist, and lab values to the baseline form to see your risk breakdown.</div>
          ) : (
            risk.rows.map((r) => (
              <div key={r.label} className={`risk-row ${r.cls}`}>
                <span className="rr-label">{r.label}</span>
                <span className="rr-value">{r.value}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-title clay">Adaptive Recommendations</div>
        <div className="section-h">What to change this week</div>
        <div id="coach-recs">
          {recs.map((r) => (
            <div key={r.head} className={`rec ${r.level}`}>
              <div className="rec-head">{r.head}</div>
              <div className="rec-detail">{r.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <CoachCharts baseline={baseline} entries={entries} />

      <div className="card">
        <div className="section-title gold">Journey</div>
        <div className="section-h">Milestones</div>
        <div className="milestones" id="milestones">
          {miles.map((m, i) => (
            <div key={m.title} className={`mile${m.done ? ' done' : ''}`}>
              <div className="mile-icon">{m.done ? '✓' : i + 1}</div>
              <div>
                <div className="mile-title">{m.title}</div>
                <div className="mile-sub">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title plum">Troubleshoot</div>
        <div className="section-h">Pick what&apos;s happening</div>
        <div className="trouble-grid">
          {Object.keys(TROUBLE_TREES).map((key) => (
            <button
              key={key}
              type="button"
              className={`trouble-btn${troubleKey === key ? ' active' : ''}`}
              onClick={() => setTroubleKey(key)}
            >
              {TROUBLE_TREES[key].title}
            </button>
          ))}
        </div>
        {trouble && (
          <div id="trouble-output" className="trouble-output">
            {trouble.steps.map((s, i) => (
              <div key={s.head} className={`rec ${i === 0 ? '' : i < 3 ? 'warn' : 'positive'}`}>
                <div className="rec-head">
                  Step {i + 1} · {s.head}
                </div>
                <div className="rec-detail">{s.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
