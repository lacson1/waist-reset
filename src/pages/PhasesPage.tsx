import { Link } from 'react-router-dom'
import { PhaseCharts } from '../components/PhaseCharts'
import { currentPhase, phaseKcalNote } from '../domain/personalisation'
import { useProgressStore } from '../store/progressStore'

export function PhasesPage() {
  const baseline = useProgressStore((s) => s.baseline)
  const phase = currentPhase(baseline)

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">16-week spine</div>
          <h1>Phases</h1>
          <div className="topbar-sub">
            Primer (6 weeks) → Attack (6) → Consolidate (6) → Maintain. Energy targets tie to your baseline TDEE on{' '}
            <Link to="/progress">My Progress</Link>.
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">Where you are</h2>
        <p>
          <strong>{phase.name}</strong> — {phaseKcalNote(phase)}
          {phase.week > 0 && ` (calendar week ${phase.week} since baseline start).`}
        </p>
        {!baseline?.date && (
          <p className="muted">Set a baseline start date on My Progress to activate phase timing.</p>
        )}
      </div>

      <PhaseCharts baseline={baseline} />

      <div className="card">
        <h2 className="section-h section-h--flush">Phase intent</h2>
        <ul className="nice-list">
          <li>
            <strong>Primer:</strong> habit installation, protein and fibre floors, gentle deficit.
          </li>
          <li>
            <strong>Attack:</strong> deeper deficit on training days with structured refeed pattern in the full
            protocol.
          </li>
          <li>
            <strong>Consolidate:</strong> taper deficit while defending waist trajectory.
          </li>
          <li>
            <strong>Maintain:</strong> eat at estimated TDEE bands; same food quality rules.
          </li>
        </ul>
      </div>
    </section>
  )
}
