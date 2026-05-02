import { Link } from 'react-router-dom'

const STACK = [
  {
    title: 'Sleep and stress',
    body: 'Seven hours minimum, caffeine cut-off, magnesium glycinate option, and cold finish showers as a free cortisol lever. Poor sleep raises cortisol 37–45% in trial ranges cited on Overview.',
    link: '/overview',
    linkLabel: 'See overview facts',
  },
  {
    title: 'Movement anchor',
    body: 'Steps and post-meal walks are the highest ROI add-on before you touch calories again. Today tracks adherence; Coach reads velocity once you log waist weekly.',
    link: '/today',
    linkLabel: 'Open Today',
  },
  {
    title: 'Accountability',
    body: 'Weekly review (local notes), export JSON from My Progress before device changes, and a clinician for medications or red-flag symptoms — not an app substitute.',
    link: '/review',
    linkLabel: 'Weekly review',
  },
]

export function SupportPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Around the plate</div>
          <h1>Support stack</h1>
          <div className="topbar-sub">
            Non-food pillars that make the eating pattern stick. Each tile links to the relevant in-app surface.
          </div>
        </div>
      </div>

      <div className="support-grid">
        {STACK.map((s) => (
          <div key={s.title} className="card support-tile">
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <Link to={s.link}>{s.linkLabel} →</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
