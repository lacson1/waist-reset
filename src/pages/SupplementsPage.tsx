import { Link } from 'react-router-dom'
import { SUPP_NO, SUPP_YES } from '../data/supplementsLists'

export function SupplementsPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Optional layer</div>
          <h1>Supplements</h1>
          <div className="topbar-sub">
            Short list with evidence and cautions. Always cross-check with <Link to="/safety">Safety</Link> and your
            clinician if you take regular medicines.
          </div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card card-top-positive">
          <h2 className="section-h section-h--flush">Reasonable adds</h2>
          <ul className="supp-yes-list">
            {SUPP_YES.map((s) => (
              <li key={s.n}>
                <strong>{s.n}</strong>
                <div className="supp-dose">{s.dose}</div>
                <p>{s.evidence}</p>
                <p className="supp-caution">
                  <em>Caution:</em> {s.caution}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card card-top-negative">
          <h2 className="section-h section-h--flush">Skip / not worth it</h2>
          <ul className="supp-no-list">
            {SUPP_NO.map((s) => (
              <li key={s.n}>
                <strong>{s.n}</strong>
                <p>{s.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
