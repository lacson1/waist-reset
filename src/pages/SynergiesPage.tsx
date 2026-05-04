import { Link } from 'react-router-dom'
import { SYNERGIES } from '../data/rulesMarkers'

export function SynergiesPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Combinations</div>
          <h1>Synergies</h1>
          <div className="topbar-sub">
            Pairs and triples where mechanisms stack — useful when building <Link to="/plate">plates</Link>,{' '}
            <Link to="/meals">meals</Link>, and <Link to="/shopping">shopping lists</Link>. Individual ingredients live
            in the <Link to="/foods">food database</Link>; mechanism-led one-for-ones are on{' '}
            <Link to="/swaps">food swaps</Link>.
          </div>
        </div>
      </div>

      <div className="synergy-grid">
        {SYNERGIES.map((s) => (
          <div key={s.t} className="synergy-card">
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
