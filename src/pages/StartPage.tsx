import { Link } from 'react-router-dom'

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bowl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a5a36" />
          <stop offset="100%" stopColor="#4a3520" />
        </linearGradient>
        <radialGradient id="bowlInner" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#8a6a44" />
          <stop offset="100%" stopColor="#3a2818" />
        </radialGradient>
        <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7da97e" />
          <stop offset="100%" stopColor="#3d6b4a" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="none" />
      {/* counter */}
      <rect x="0" y="220" width="400" height="80" fill="rgba(255,255,255,0.55)" />
      {/* window light */}
      <rect x="40" y="30" width="320" height="160" rx="8" fill="rgba(255,255,255,0.4)" />
      <rect x="40" y="30" width="320" height="160" rx="8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <line x1="200" y1="30" x2="200" y2="190" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="40" y1="110" x2="360" y2="110" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      {/* plant */}
      <rect x="320" y="150" width="40" height="40" rx="4" fill="#caa882" />
      <ellipse cx="340" cy="140" rx="16" ry="22" fill="url(#leaf)" />
      <ellipse cx="328" cy="148" rx="10" ry="18" fill="#5a8c5d" />
      {/* bowl */}
      <ellipse cx="200" cy="240" rx="120" ry="34" fill="url(#bowl)" />
      <ellipse cx="200" cy="232" rx="118" ry="28" fill="url(#bowlInner)" />
      {/* veg in bowl */}
      <ellipse cx="160" cy="222" rx="22" ry="14" fill="#5a8c5d" />
      <ellipse cx="190" cy="216" rx="18" ry="12" fill="#7da97e" />
      <ellipse cx="218" cy="220" rx="20" ry="13" fill="#3d6b4a" />
      <circle cx="244" cy="226" r="9" fill="#c64530" />
      <circle cx="156" cy="232" r="7" fill="#e8a13a" />
      <ellipse cx="180" cy="234" rx="11" ry="6" fill="#cfa766" />
      <circle cx="232" cy="240" r="6" fill="#c64530" />
      <ellipse cx="208" cy="240" rx="9" ry="5" fill="#e8a13a" />
      {/* leafy top */}
      <ellipse cx="200" cy="208" rx="14" ry="9" fill="#5a8c5d" />
      <ellipse cx="178" cy="206" rx="9" ry="6" fill="#7da97e" />
    </svg>
  )
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export function StartPage() {
  return (
    <section className="view active">
      <div className="stitch-hero">
        <div className="stitch-hero__copy">
          <div className="eyebrow">Welcome</div>
          <h1>Reset your health from the inside out.</h1>
          <div className="topbar-sub">
            A structured eating system focused on waist and blood-sugar markers.
            Achieve lasting results without extreme restrictions — your data stays in
            your browser and works offline after first load.
          </div>
          <div className="stitch-hero__ctas">
            <Link className="btn" to="/today">Get started</Link>
            <Link className="btn btn-ghost" to="/plate">Learn more</Link>
          </div>
        </div>
        <div className="stitch-hero__art">
          <HeroIllustration />
        </div>
      </div>

      <div className="stitch-section">
        <div className="stitch-section__head">
          <h2>Three things to do this week</h2>
          <p>A short on-ramp before the protocol takes over.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-card__icon">
              <Icon d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </span>
            <h3>Read the safety screen</h3>
            <p>
              Some conditions and medications need a clinician first. See{' '}
              <Link to="/safety">Safety</Link> before changing how you eat.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">
              <Icon d="M3 3v18h18M7 14l4-4 4 4 5-5" />
            </span>
            <h3>Calculate your numbers</h3>
            <p>
              Personalised calories and protein on{' '}
              <Link to="/progress">My Progress</Link> and{' '}
              <Link to="/numbers">Your Numbers</Link>.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">
              <Icon d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </span>
            <h3>Log daily</h3>
            <p>
              Use the <Link to="/plate">Plate System</Link> for meals,{' '}
              <Link to="/today">Today</Link> for checklists, and{' '}
              <Link to="/coach">Coach</Link> for adaptive feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="stitch-section">
        <div className="stitch-section__head">
          <h2>A comprehensive approach</h2>
          <p>Tools and guidance designed for sustainable, long-term metabolic health.</p>
        </div>
        <div className="split-feature">
          <div className="split-feature__body">
            <h3>Precision tracking</h3>
            <p>
              Go beyond the scale. Track the metrics that matter most for metabolic
              health, including waist-to-height ratio and trend analysis.
            </p>
            <ul className="split-feature__bullets">
              <li>Daily metric logging</li>
              <li>Visual trend graphs</li>
              <li>Phase-aware adherence scoring</li>
            </ul>
          </div>
          <div className="split-feature__media" aria-hidden="true">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="#2c4636" />
              <rect x="40" y="50" width="320" height="200" rx="14" fill="#f4f1e8" />
              <rect x="60" y="78" width="120" height="10" rx="3" fill="#2c4636" />
              <rect x="60" y="96" width="80" height="6" rx="2" fill="#9aa6a0" />
              <polyline points="60,200 100,170 140,180 180,140 220,150 260,110 300,120 340,90" stroke="#3a5641" strokeWidth="3" fill="none" />
              <circle cx="320" cy="200" r="32" fill="none" stroke="#cfd5cb" strokeWidth="8" />
              <path d="M 320 168 A 32 32 0 0 1 348 215" stroke="#3a5641" strokeWidth="8" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="split-feature split-feature--reverse" style={{ marginTop: 16 }}>
          <div className="split-feature__media" aria-hidden="true">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="#2c4636" />
              <ellipse cx="200" cy="170" rx="130" ry="36" fill="#1a2a1f" />
              <ellipse cx="200" cy="160" rx="128" ry="32" fill="#f6f3eb" />
              <ellipse cx="200" cy="158" rx="118" ry="26" fill="#ede8d8" />
              <ellipse cx="160" cy="148" rx="34" ry="14" fill="#5a8c5d" />
              <ellipse cx="190" cy="142" rx="24" ry="11" fill="#7da97e" />
              <ellipse cx="240" cy="156" rx="38" ry="14" fill="#d2724a" />
              <circle cx="248" cy="150" r="6" fill="#fbf6e6" />
              <ellipse cx="180" cy="166" rx="14" ry="6" fill="#cfa766" />
              <circle cx="220" cy="170" r="5" fill="#e8a13a" />
            </svg>
          </div>
          <div className="split-feature__body">
            <h3>Metabolic meal plans</h3>
            <p>
              Enjoy satiating meals designed to optimise blood sugar levels and
              encourage your body to use stored energy.
            </p>
            <ul className="split-feature__bullets">
              <li>Insulin-conscious recipes</li>
              <li>Flexible eating schedules</li>
              <li>Plate templates for rest, training, and soup days</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="stitch-section">
        <div className="stitch-section__head">
          <h2>Scope</h2>
          <p>What this is — and what it isn&apos;t — before you commit.</p>
        </div>
        <div className="two-col-grid">
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
      </div>

      <div className="cta-banner">
        <h2>Ready to change your life?</h2>
        <p>Start your Waist Reset today and take control of your metabolic health.</p>
        <Link className="btn" to="/today">Get started now</Link>
      </div>
    </section>
  )
}
