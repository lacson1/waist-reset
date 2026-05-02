import { Link } from 'react-router-dom'
import { BIOMARKERS } from '../data/rulesMarkers'

export function BiomarkersPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Labs</div>
          <h1>Biomarkers</h1>
          <div className="topbar-sub">
            Targets and cadence aligned with visceral-fat and insulin-resistance pathways. Log what you have on{' '}
            <Link to="/progress">My Progress</Link> — optional TG/HDL on dated rows feed Coach risk and the lab snapshot
            table.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Marker</th>
                <th>Target</th>
                <th>Frequency</th>
                <th>Why it tracks VAT</th>
              </tr>
            </thead>
            <tbody>
              {BIOMARKERS.map((row) => (
                <tr key={row.name} className={row.priority ? 'row-priority' : undefined}>
                  <td>
                    <strong>{row.name}</strong>
                    {row.priority && <span className="pill pill--high">Priority</span>}
                  </td>
                  <td>{row.target}</td>
                  <td>{row.freq}</td>
                  <td>{row.link}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
