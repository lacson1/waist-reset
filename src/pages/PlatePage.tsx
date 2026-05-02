import { Link } from 'react-router-dom'
import { useProgressStore } from '../store/progressStore'
import { computePersonal, phaseKcal, phaseKcalNote, currentPhase } from '../domain/personalisation'
import { PLATE_SCENARIOS, PLATE_SWAPS } from '../data/plateContent'
import { RestDayPlateSvg } from '../components/plate/RestDayPlateSvg'
import { TrainingDayPlateSvg } from '../components/plate/TrainingDayPlateSvg'
import { SoupBowlSvg } from '../components/plate/SoupBowlSvg'

export function PlatePage() {
  const baseline = useProgressStore((s) => s.baseline)
  const phase = currentPhase(baseline)
  const personal = computePersonal(baseline)
  const kcal = phaseKcal(phase, baseline)
  const kcalNote = phaseKcalNote(phase)

  return (
    <section className="view active plate-page">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Plate-Building System</div>
          <h1>Build the plate, not the calorie count.</h1>
          <div className="topbar-sub">
            Three plate templates. Choose the one that matches your day. Calorie targets come from your{' '}
            <Link to="/progress">baseline on My Progress</Link> for phase kcal and protein chips; use{' '}
            <Link to="/numbers">Your Numbers</Link> for a standalone Mifflin–St Jeor pass. The plate structure stays
            the same either way.
          </div>
        </div>
        {kcal != null && (
          <div className="topbar-right">
            <span className="chip teal">{kcal} kcal</span>
            <span className="chip gold">{kcalNote}</span>
            {personal.protein != null && (
              <span className="chip clay">~{personal.protein} g protein</span>
            )}
          </div>
        )}
      </div>

      <div className="plate-templates-grid">
        <article className="plate-template-card plate-template-card--teal">
          <h3>Rest-day plate</h3>
          <div className="plate-svg-wrap">
            <RestDayPlateSvg />
          </div>
          <div className="plate-copy">
            <p>
              <strong>½ plate · Vegetables</strong> — leafy greens (spinach, ugu, ewedu, kale), cruciferous
              (broccoli, cabbage, cauliflower), volume veg (cucumber, tomato, peppers).
            </p>
            <p>
              <strong>¼ plate · Lean protein</strong> — sardines, chicken thigh, salmon, eggs, tofu, stockfish,
              Greek yoghurt.
            </p>
            <p>
              <strong>¼ plate · Fibre</strong> — lentils, chickpeas, beans (small portion only on rest days).
            </p>
            <p>
              <strong>+ Drizzle</strong> — 1 tbsp EVOO or ½ avocado.
            </p>
          </div>
        </article>

        <article className="plate-template-card plate-template-card--clay">
          <h3>Training-day plate</h3>
          <div className="plate-svg-wrap">
            <TrainingDayPlateSvg />
          </div>
          <div className="plate-copy">
            <p>
              <strong>½ plate · Vegetables</strong> — same as rest day.
            </p>
            <p>
              <strong>¼ plate · Lean protein</strong> — slightly larger portion (+10g) around training.
            </p>
            <p>
              <strong className="text-clay">¼ plate · Slow carbs</strong> — green plantain, sweet potato, lentils,
              teff, sorghum, fonio, quinoa, pearled barley. Cook then cool for resistant starch.
            </p>
            <p>
              <strong>+ Drizzle</strong> — 1 tbsp EVOO.
            </p>
          </div>
        </article>

        <article className="plate-template-card plate-template-card--plum">
          <h3>Soup-meal bowl</h3>
          <div className="plate-svg-wrap">
            <SoupBowlSvg />
          </div>
          <div className="plate-copy">
            <p>
              <strong>Base</strong> — pepper soup or ogbono / okra / efo riro / edikang ikong.
            </p>
            <p>
              <strong>Protein anchor</strong> — stockfish, tilapia, catfish, chicken, eggs, or boiled goat.
            </p>
            <p>
              <strong>Leafy volume</strong> — ugu, ewedu, waterleaf, bitter leaf, amaranth.
            </p>
            <p>
              <strong>Aromatics</strong> — uziza, scotch bonnet, dawadawa, ginger, garlic, crayfish.
            </p>
            <p>
              <strong>Optional</strong> — small green plantain on training days.
            </p>
          </div>
        </article>
      </div>

      <div className="card plate-swaps-card">
        <h2 className="section-h section-h--flush">African ↔ Western swaps</h2>
        <p className="plate-lead">
          Same plate template, different cuisines. The mechanism is the structure, not the specific food. For
          mechanism-graded substitutions across drinks, carbs, snacks, oils, and more, see{' '}
          <Link to="/swaps">Food Swaps</Link>.
        </p>
        <div className="swap-table-wrap">
          <table className="swap-table">
            <thead>
              <tr>
                <th>Plate slot</th>
                <th>Western default</th>
                <th>African swap</th>
                <th>Why they&apos;re equivalent</th>
              </tr>
            </thead>
            <tbody>
              {PLATE_SWAPS.map((row) => (
                <tr key={row.slot}>
                  <td className="swap-slot">{row.slot}</td>
                  <td>{row.western}</td>
                  <td className="swap-african">{row.african}</td>
                  <td className="swap-why">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card plate-scenarios-card">
        <h3>Quick-pick by scenario</h3>
        <div className="plate-scenarios-grid">
          {PLATE_SCENARIOS.map((s) => (
            <div key={s.title} className="plate-scenario-tile">
              <strong>{s.title}</strong>
              <span>{s.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
