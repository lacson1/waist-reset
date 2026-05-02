import { Link } from 'react-router-dom'

const LINKS: { title: string; href: string; note: string }[] = [
  {
    title: 'NICE guidance — overweight and obesity',
    href: 'https://www.nice.org.uk/guidance/cg189',
    note: 'UK NHS commissioning context for weight management.',
  },
  {
    title: 'WHO — healthy diet',
    href: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    note: 'Population-level macronutrient and fibre framing.',
  },
  {
    title: 'PREDIMED trial hub',
    href: 'https://www.predimed.es/',
    note: 'Mediterranean pattern + EVOO evidence base referenced in the protocol foods.',
  },
]

export function ResourcesPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Deeper reading</div>
          <h1>Resources</h1>
          <div className="topbar-sub">
            External references. In-app execution lives in <Link to="/plate">Plate</Link>,{' '}
            <Link to="/foods">Food database</Link>, and <Link to="/coach">Coach</Link>.
          </div>
        </div>
      </div>

      <div className="resource-grid">
        {LINKS.map((r) => (
          <a key={r.href} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer">
            <h3>{r.title}</h3>
            <p>{r.note}</p>
            <span className="resource-open">Open ↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}
