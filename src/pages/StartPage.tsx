import { Link } from 'react-router-dom'

export function StartPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Welcome</div>
          <h1>Start here.</h1>
          <div className="topbar-sub">
            A structured eating system focused on waist circumference, blood-sugar markers, and a pattern you
            can sustain. This React build keeps your data in the browser (with optional backup) and works
            offline after the first load.
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h" style={{ marginTop: 0 }}>
          Three things to do this week
        </h2>
        <div className="quickstart-grid">
          <div className="qs-card qs-danger">
            <div className="qs-head">
              <span className="qs-num">1</span>
              <strong>Read the safety screen</strong>
            </div>
            <p className="qs-body">
              Some conditions and medications need a clinician first. See{' '}
              <Link to="/safety">Safety</Link>.
            </p>
          </div>
          <div className="qs-card qs-teal">
            <div className="qs-head">
              <span className="qs-num">2</span>
              <strong>Calculate your numbers</strong>
            </div>
            <p className="qs-body">
              Personalised calories and protein are on <Link to="/progress">My Progress</Link> (baseline form)
              and <Link to="/numbers">Your Numbers</Link> (Mifflin–St Jeor + deficit bands — pull from baseline
              when present).
            </p>
          </div>
          <div className="qs-card qs-gold">
            <div className="qs-head">
              <span className="qs-num">3</span>
              <strong>Log daily</strong>
            </div>
            <p className="qs-body">
              Use <Link to="/today">Today</Link> for checklists and quick log, and <Link to="/coach">Coach</Link>{' '}
              for adaptive feedback once you have a baseline.
            </p>
          </div>
        </div>
      </div>

      <div className="two-col-grid" style={{ marginTop: 18 }}>
        <div className="card card-top-positive">
          <h3>What this is</h3>
          <ul className="nice-list">
            <li>Evidence-informed eating system</li>
            <li>Personalised to your body</li>
            <li>16-week phased structure in the coach engine</li>
            <li>Tracked by waist, WHtR, and metabolic markers</li>
          </ul>
        </div>
        <div className="card card-top-negative">
          <h3>What this is not</h3>
          <ul className="nice-list">
            <li>Not a substitute for medical care</li>
            <li>Not a diagnosis or prescription tool</li>
            <li>Not cloud-synced yet (export JSON to move devices)</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
