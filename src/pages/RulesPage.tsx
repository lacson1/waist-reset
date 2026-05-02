import { useState } from 'react'
import { RULES_AFRICAN, RULES_GENERAL } from '../data/rulesMarkers'

function sevPill(sev: string): string {
  if (sev === 'CRITICAL') return 'pill pill--critical'
  if (sev === 'HIGH') return 'pill pill--high'
  return 'pill pill--medium'
}

export function RulesPage() {
  const [tab, setTab] = useState<'general' | 'african'>('general')
  const rules = tab === 'general' ? RULES_GENERAL : RULES_AFRICAN

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Non-negotiables</div>
          <h1>Rules</h1>
          <div className="topbar-sub">
            Severity-tagged habits from the original protocol. African track adds regional swaps with evidence grades
            where quoted.
          </div>
        </div>
      </div>

      <div className="sub-tabs">
        <button type="button" className={tab === 'general' ? 'sub-tab active' : 'sub-tab'} onClick={() => setTab('general')}>
          General
        </button>
        <button type="button" className={tab === 'african' ? 'sub-tab active' : 'sub-tab'} onClick={() => setTab('african')}>
          African track
        </button>
      </div>

      <div className="rules-grid">
        {rules.map((r) => (
          <div key={r.name} className="rule-card">
            <div className="rule-card-head">
              <span className={sevPill(r.sev)}>{r.sev}</span>
              {r.ev != null && r.ev !== '' && <span className="pill pill--teal">Ev {r.ev}</span>}
            </div>
            <h3>{r.name}</h3>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
