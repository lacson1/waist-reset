import { CONTRAINDICATIONS, INTERACTIONS, SAFETY_SUPPLEMENTS } from '../data/safety'

function sevClass(sev: string): string {
  if (sev === 'critical') return 'pill pill--critical'
  if (sev === 'high') return 'pill pill--high'
  return 'pill pill--medium'
}

export function SafetyPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Before you start</div>
          <h1>Safety</h1>
          <div className="topbar-sub">
            Contraindications, common drug–food interactions, and supplement cautions from the protocol. This is
            educational, not personalised medical advice.
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">When to involve a clinician first</h2>
        <ul className="safety-list">
          {CONTRAINDICATIONS.map((c) => (
            <li key={c.title}>
              <strong>{c.title}</strong>
              <p>{c.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">Drug and food interactions</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Drug / class</th>
                <th>With</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {INTERACTIONS.map((row) => (
                <tr key={row.drug + row.with}>
                  <td>
                    <span className={sevClass(row.sev)}>{row.sev}</span>
                  </td>
                  <td>{row.drug}</td>
                  <td>{row.with}</td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">Foods and supplements — practical cautions</h2>
        <div className="facts-grid">
          {SAFETY_SUPPLEMENTS.map((s) => (
            <div key={s.name} className={`fact-card fact-card--${s.sev}`}>
              <span className={sevClass(s.sev)}>{s.sev}</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
