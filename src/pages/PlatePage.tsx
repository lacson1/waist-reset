import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useProgressStore } from '../store/progressStore'
import { computePersonal, phaseKcal, phaseKcalNote, currentPhase } from '../domain/personalisation'
import { PLATE_SCENARIOS, PLATE_SWAPS } from '../data/plateContent'
import { RestDayPlateSvg, type RestDaySlot } from '../components/plate/RestDayPlateSvg'
import { TrainingDayPlateSvg, type TrainingDaySlot } from '../components/plate/TrainingDayPlateSvg'
import { SoupBowlSvg, type SoupBowlSlot } from '../components/plate/SoupBowlSvg'

function PlateCopyLine<S extends string>({
  slot,
  active,
  onPick,
  children,
}: {
  slot: S
  active: S | null
  onPick: () => void
  children: ReactNode
}) {
  const focused = active === slot
  return (
    <button
      type="button"
      className={`plate-copy-line plate-copy-line--btn${focused ? ' is-focused' : ''}`}
      data-slot={slot}
      aria-pressed={focused}
      onClick={onPick}
    >
      {children}
    </button>
  )
}

export function PlatePage() {
  const baseline = useProgressStore((s) => s.baseline)
  const phase = currentPhase(baseline)
  const personal = computePersonal(baseline)
  const kcal = phaseKcal(phase, baseline)
  const kcalNote = phaseKcalNote(phase)

  const [restSlot, setRestSlot] = useState<RestDaySlot | null>(null)
  const [trainSlot, setTrainSlot] = useState<TrainingDaySlot | null>(null)
  const [soupSlot, setSoupSlot] = useState<SoupBowlSlot | null>(null)

  const toggleRest = (s: RestDaySlot) => setRestSlot((p) => (p === s ? null : s))
  const toggleTrain = (s: TrainingDaySlot) => setTrainSlot((p) => (p === s ? null : s))
  const toggleSoup = (s: SoupBowlSlot) => setSoupSlot((p) => (p === s ? null : s))

  return (
    <section className="view active plate-page">
      <div className="topbar plate-page-topbar">
        <div className="topbar-left">
          <div className="eyebrow">Plate-Building System</div>
          <h1>Build the plate, not the calorie count.</h1>
          <div className="topbar-sub">
            Three plate templates. Choose the one that matches your day. Calorie targets come from your{' '}
            <Link to="/progress">baseline on My Progress</Link> for phase kcal and protein chips; use{' '}
            <Link to="/numbers">Your Numbers</Link> for a standalone Mifflin–St Jeor pass. The plate structure stays
            the same either way.
          </div>
          <p className="plate-split-hint plate-split-hint--topbar">
            <strong>You build the plate:</strong> tap a coloured wedge or a bullet — the diagram and the text stay in
            sync.
          </p>
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
        <article className="plate-template-card plate-template-card--teal plate-template-card--split">
          <header className="plate-template-card__head">
            <h3>Rest-day plate</h3>
            <span className="plate-template-card__tag">Interactive</span>
          </header>
          <div className="plate-split-body">
            <div className="plate-split-media">
              <RestDayPlateSvg interactive activeSlot={restSlot} onSlotSelect={toggleRest} />
              <span className="plate-split-hint">Tap a wedge</span>
            </div>
            <div className="plate-split-copy plate-copy">
              <PlateCopyLine<RestDaySlot> slot="veg" active={restSlot} onPick={() => toggleRest('veg')}>
                <strong>½ plate · Vegetables</strong> — leafy greens (spinach, ugu, ewedu, kale), cruciferous
                (broccoli, cabbage, cauliflower), volume veg (cucumber, tomato, peppers).
              </PlateCopyLine>
              <PlateCopyLine<RestDaySlot> slot="protein" active={restSlot} onPick={() => toggleRest('protein')}>
                <strong>¼ plate · Lean protein</strong> — sardines, chicken thigh, salmon, eggs, tofu, stockfish,
                Greek yoghurt.
              </PlateCopyLine>
              <PlateCopyLine<RestDaySlot> slot="fibre" active={restSlot} onPick={() => toggleRest('fibre')}>
                <strong>¼ plate · Fibre</strong> — lentils, chickpeas, beans (small portion only on rest days).
              </PlateCopyLine>
              <p className="plate-copy-line plate-copy-line--static plate-copy-line--drizzle">
                <strong>+ Drizzle</strong> — 1 tbsp EVOO or ½ avocado.
              </p>
            </div>
          </div>
        </article>

        <article className="plate-template-card plate-template-card--clay plate-template-card--split">
          <header className="plate-template-card__head">
            <h3>Training-day plate</h3>
            <span className="plate-template-card__tag">Interactive</span>
          </header>
          <div className="plate-split-body">
            <div className="plate-split-media">
              <TrainingDayPlateSvg interactive activeSlot={trainSlot} onSlotSelect={toggleTrain} />
              <span className="plate-split-hint">Tap a wedge</span>
            </div>
            <div className="plate-split-copy plate-copy">
              <PlateCopyLine<TrainingDaySlot> slot="veg" active={trainSlot} onPick={() => toggleTrain('veg')}>
                <strong>½ plate · Vegetables</strong> — same as rest day.
              </PlateCopyLine>
              <PlateCopyLine<TrainingDaySlot> slot="protein" active={trainSlot} onPick={() => toggleTrain('protein')}>
                <strong>¼ plate · Lean protein</strong> — slightly larger portion (+10g) around training.
              </PlateCopyLine>
              <PlateCopyLine<TrainingDaySlot> slot="carbs" active={trainSlot} onPick={() => toggleTrain('carbs')}>
                <strong className="text-clay">¼ plate · Slow carbs</strong> — green plantain, sweet potato, lentils,
                teff, sorghum, fonio, quinoa, pearled barley. Cook then cool for resistant starch.
              </PlateCopyLine>
              <p className="plate-copy-line plate-copy-line--static plate-copy-line--drizzle">
                <strong>+ Drizzle</strong> — 1 tbsp EVOO.
              </p>
            </div>
          </div>
        </article>

        <article className="plate-template-card plate-template-card--plum plate-template-card--split">
          <header className="plate-template-card__head">
            <h3>Soup-meal bowl</h3>
            <span className="plate-template-card__tag plate-template-card__tag--plum">Interactive</span>
          </header>
          <div className="plate-split-body">
            <div className="plate-split-media">
              <SoupBowlSvg interactive activeSlot={soupSlot} onSlotSelect={toggleSoup} />
              <span className="plate-split-hint">Tap a layer</span>
            </div>
            <div className="plate-split-copy plate-copy">
              <PlateCopyLine<SoupBowlSlot> slot="base" active={soupSlot} onPick={() => toggleSoup('base')}>
                <strong>Base</strong> — pepper soup or ogbono / okra / efo riro / edikang ikong.
              </PlateCopyLine>
              <PlateCopyLine<SoupBowlSlot> slot="protein" active={soupSlot} onPick={() => toggleSoup('protein')}>
                <strong>Protein anchor</strong> — stockfish, tilapia, catfish, chicken, eggs, or boiled goat.
              </PlateCopyLine>
              <PlateCopyLine<SoupBowlSlot> slot="leafy" active={soupSlot} onPick={() => toggleSoup('leafy')}>
                <strong>Leafy volume</strong> — ugu, ewedu, waterleaf, bitter leaf, amaranth.
              </PlateCopyLine>
              <PlateCopyLine<SoupBowlSlot> slot="aromatics" active={soupSlot} onPick={() => toggleSoup('aromatics')}>
                <strong>Aromatics</strong> — uziza, scotch bonnet, dawadawa, ginger, garlic, crayfish.
              </PlateCopyLine>
              <PlateCopyLine<SoupBowlSlot> slot="optional" active={soupSlot} onPick={() => toggleSoup('optional')}>
                <strong>Optional</strong> — small green plantain on training days.
              </PlateCopyLine>
            </div>
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
