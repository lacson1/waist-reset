import { Link } from 'react-router-dom'
import { TROUBLESHOOT_SYMPTOMS, tsSevColor, tsSevLabel } from '../data/troubleshootSymptoms'

export function TroubleshootPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Self-check</div>
          <h1>Troubleshoot</h1>
          <div className="topbar-sub">
            Symptom → likely cause → next action. For adaptive trees tied to your logs, use{' '}
            <Link to="/coach">Coach</Link>.
          </div>
        </div>
      </div>

      <div className="troubleshoot-grid">
        {TROUBLESHOOT_SYMPTOMS.map((c) => (
          <article key={c.sym} className="troubleshoot-card" style={{ borderTopColor: tsSevColor[c.sev] }}>
            <div className="troubleshoot-card-head">
              <span className="ts-badge" style={{ background: tsSevColor[c.sev] }}>
                {tsSevLabel[c.sev]}
              </span>
              <h3>{c.sym}</h3>
            </div>
            <p className="ts-cause">
              <strong>Likely:</strong> {c.cause}
            </p>
            <p className="ts-action">{c.action}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
