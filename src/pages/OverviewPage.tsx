import { Link } from 'react-router-dom'
import { OVERVIEW_FACTS } from '../data/overviewFacts'
import { computePersonal, computeTgHdl, computeWHtR, currentPhase, phaseKcalNote } from '../domain/personalisation'
import { useProgressStore } from '../store/progressStore'

export function OverviewPage() {
  const baseline = useProgressStore((s) => s.baseline)
  const pers = computePersonal(baseline)
  const phase = currentPhase(baseline)
  const whtr = computeWHtR(baseline?.waist, baseline?.height)
  const ratio = computeTgHdl(baseline?.tg, baseline?.hdl)

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Big picture</div>
          <h1>Overview</h1>
          <div className="topbar-sub">
            Evidence snapshots that motivate the protocol structure. Your live KPIs appear when a baseline exists on{' '}
            <Link to="/progress">My Progress</Link>.
          </div>
        </div>
      </div>

      {baseline?.date && (
        <div className="card">
          <h2 className="section-h section-h--flush">Your snapshot</h2>
          <div className="kpi-grid">
            <div className="kpi">
              <div className="kpi-label">Phase</div>
              <div className="kpi-value">
                {phase.num > 0 ? `${phase.name} · week ${phase.week}` : phase.name}
              </div>
              <div className="kpi-sub">{phaseKcalNote(phase)}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">TDEE (est.)</div>
              <div className="kpi-value">{pers.tdee != null ? `${Math.round(pers.tdee)} kcal` : '—'}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Protein anchor</div>
              <div className="kpi-value">{pers.protein != null ? `${pers.protein} g` : '—'}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">WHtR</div>
              <div className="kpi-value">{whtr != null ? whtr.toFixed(2) : '—'}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">TG:HDL</div>
              <div className="kpi-value">{ratio != null ? ratio.toFixed(2) : '—'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="section-h section-h--flush">Why these levers work</h2>
        <div className="facts-grid">
          {OVERVIEW_FACTS.map((f) => (
            <div key={f.title} className={`fact-card${f.variant ? ` fact-card--tone-${f.variant}` : ''}`}>
              <div className="fact-stat">{f.stat}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
