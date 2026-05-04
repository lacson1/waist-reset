import { Link } from 'react-router-dom'

export function MealsPage() {
  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Composition</div>
          <h1>Meal builder</h1>
          <div className="topbar-sub">
            The legacy HTML meal builder is large. This page captures the non-negotiable structure; use Plate and Food
            database for concrete portions.
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">Every main meal</h2>
        <ol className="nice-list">
          <li>Lean protein first (target leucine across the day, not only this meal).</li>
          <li>EVOO or traditional fat within thermal limits; add aromatics (garlic, ginger, pepper).</li>
          <li>Double fibre: cruciferous or African leafy volume + legume or RS starch on carb days.</li>
          <li>Carb last if included — same-day training biases starch timing in the full ruleset.</li>
        </ol>
      </div>

      <div className="two-col-grid">
        <div className="card card-top-teal">
          <h3>In-app tools</h3>
          <ul className="nice-list">
            <li>
              <Link to="/plate">Plate system</Link> — templates and African ↔ Western slot swaps.
            </li>
            <li>
              <Link to="/swaps">Food swaps</Link> — top 10 and category tables (VAT mechanisms).
            </li>
            <li>
              <Link to="/foods">Food database</Link> — macros and prep notes.
            </li>
            <li>
              <Link to="/synergies">Synergies</Link> — pairs and triples where mechanisms stack.
            </li>
            <li>
              <Link to="/daily">Daily plan</Link> — clock-shaped example day.
            </li>
          </ul>
        </div>
        <div className="card card-top-gold">
          <h3>Quick anchors</h3>
          <ul className="nice-list">
            <li>Wed + Sat as higher-legume / plantain carb windows in the standard rules.</li>
            <li>ACV only diluted; green tea spaced from iron-rich plates.</li>
            <li>Log adherence on Today so Coach can respond to stalls.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
