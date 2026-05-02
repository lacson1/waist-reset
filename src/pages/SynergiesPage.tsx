import { SYNERGIES } from '../data/rulesMarkers'

export function SynergiesPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Combinations</div>
          <h1>Synergies</h1>
          <div className="topbar-sub">
            Pairs and triples where mechanisms stack — useful when building plates and shopping lists.
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
