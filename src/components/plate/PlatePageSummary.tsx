import { useMemo } from 'react'
import { usePlateBuilderStore } from '../../store/plateBuilderStore'
import {
  type MealSlot,
  compareToPhase,
  slotLabel,
  slotsForTemplate,
  sumMacros,
} from '../../domain/plateMeal'

type Props = {
  phaseKcal: number | null
  targetProtein: number | null
  onJumpToBuilder: () => void
  onFocusSlot: (slot: MealSlot) => void
}

/** Live, sticky read-out of the plate vs. phase targets — answers "am I on track?" without scrolling. */
export function PlatePageSummary({ phaseKcal, targetProtein, onJumpToBuilder, onFocusSlot }: Props) {
  const template = usePlateBuilderStore((s) => s.template)
  const items = usePlateBuilderStore((s) => s.items)

  const totals = useMemo(() => sumMacros(items), [items])
  const compare = useMemo(
    () => compareToPhase(totals, phaseKcal, targetProtein),
    [totals, phaseKcal, targetProtein],
  )

  const slots = slotsForTemplate(template)
  const filledSet = useMemo(() => new Set(items.map((it) => it.slot)), [items])
  const filledCount = slots.reduce((n, s) => (filledSet.has(s) ? n + 1 : n), 0)

  const kcalPct = compare.pctOfDayKcal
  const kcalBarPct = phaseKcal != null && phaseKcal > 0
    ? Math.min(100, Math.round((totals.kcal / phaseKcal) * 100))
    : 0
  const kcalState =
    phaseKcal == null
      ? 'idle'
      : totals.kcal === 0
        ? 'idle'
        : kcalPct != null && kcalPct > 110
          ? 'over'
          : kcalPct != null && kcalPct >= 80
            ? 'ontrack'
            : 'low'

  const proteinPct = compare.proteinVsTargetRatio
  const proteinBarPct = targetProtein != null && targetProtein > 0
    ? Math.min(100, Math.round((totals.p / targetProtein) * 100))
    : 0
  const proteinState =
    targetProtein == null
      ? 'idle'
      : totals.p === 0
        ? 'idle'
        : proteinPct != null && proteinPct >= 100
          ? 'met'
          : proteinPct != null && proteinPct >= 70
            ? 'close'
            : 'low'

  const empty = items.length === 0

  return (
    <section className="plate-page-summary" aria-label="Plate summary">
      <div className="plate-page-summary__row">
        <div
          className={`plate-page-summary__metric plate-page-summary__metric--kcal is-${kcalState}`}
          aria-label={`Calories: ${Math.round(totals.kcal)} of ${phaseKcal ?? '—'} kcal`}
        >
          <div className="plate-page-summary__metric-head">
            <span className="plate-page-summary__metric-label">Calories</span>
            <span className="plate-page-summary__metric-value">
              <strong>{Math.round(totals.kcal)}</strong>
              {phaseKcal != null ? <span className="muted"> / {phaseKcal}</span> : null}
              {kcalPct != null ? <span className="plate-page-summary__pct">{kcalPct}%</span> : null}
            </span>
          </div>
          <div
            className="plate-page-summary__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={kcalBarPct}
            aria-valuetext={kcalPct != null ? `${kcalPct}% of calorie target` : 'Calorie target unset'}
          >
            <span style={{ width: `${kcalBarPct}%` }} />
          </div>
        </div>

        <div
          className={`plate-page-summary__metric plate-page-summary__metric--protein is-${proteinState}`}
          aria-label={`Protein: ${Math.round(totals.p)} of ${targetProtein ?? '—'} grams`}
        >
          <div className="plate-page-summary__metric-head">
            <span className="plate-page-summary__metric-label">Protein</span>
            <span className="plate-page-summary__metric-value">
              <strong>{Math.round(totals.p)}g</strong>
              {targetProtein != null ? <span className="muted"> / {targetProtein}g</span> : null}
              {proteinPct != null ? <span className="plate-page-summary__pct">{proteinPct}%</span> : null}
            </span>
          </div>
          <div
            className="plate-page-summary__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={proteinBarPct}
            aria-valuetext={proteinPct != null ? `${proteinPct}% of protein target` : 'Protein target unset'}
          >
            <span style={{ width: `${proteinBarPct}%` }} />
          </div>
        </div>

        <div className="plate-page-summary__macros" role="group" aria-label="Macros breakdown">
          <span className="plate-page-summary__macro" title="Carbs (g)">
            <span className="muted">C</span>
            <strong>{Math.round(totals.c)}</strong>
          </span>
          <span className="plate-page-summary__macro" title="Fat (g)">
            <span className="muted">F</span>
            <strong>{Math.round(totals.f)}</strong>
          </span>
        </div>

        <button
          type="button"
          className="btn btn-sm plate-page-summary__cta"
          onClick={onJumpToBuilder}
        >
          {empty ? 'Start building' : 'Edit plate'}
        </button>
      </div>

      <div className="plate-page-summary__slots" role="group" aria-label="Wedge fill">
        <span className="plate-page-summary__slots-label">
          Wedges {filledCount}/{slots.length}
        </span>
        <ul className="plate-page-summary__slots-list">
          {slots.map((slot) => {
            const filled = filledSet.has(slot)
            return (
              <li key={slot}>
                <button
                  type="button"
                  className={`plate-page-summary__slot${filled ? ' is-filled' : ''}`}
                  onClick={() => onFocusSlot(slot)}
                  aria-label={`${slotLabel(template, slot)} — ${filled ? 'filled' : 'empty'}; jump to builder`}
                  title={slotLabel(template, slot)}
                >
                  <span className="plate-page-summary__slot-dot" aria-hidden />
                  <span className="plate-page-summary__slot-text">{slotLabel(template, slot)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
