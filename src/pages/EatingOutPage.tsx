import { EATOUT_SCENARIOS } from '../data/shoppingEatout'

export function EatingOutPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Social eating</div>
          <h1>Eating out</h1>
          <div className="topbar-sub">
            Scenario cards: what to lean toward, what to sidestep, without pretending restaurants are laboratories.
          </div>
        </div>
      </div>

      <div className="eatout-grid">
        {EATOUT_SCENARIOS.map((s) => (
          <div key={s.scenario} className="eatout-card">
            <span className="eatout-cuisine">{s.cuisine}</span>
            <h3>{s.scenario}</h3>
            <p>
              <strong>Pick:</strong> {s.pick}
            </p>
            <p>
              <strong>Avoid:</strong> {s.avoid}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
