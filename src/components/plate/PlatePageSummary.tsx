import { useMemo } from 'react'
import { usePlateBuilderStore } from '../../store/plateBuilderStore'
import {
  type MealSlot,
  slotLabel,
  slotsForTemplate,
  sumMacros,
} from '../../domain/plateMeal'
import {
  mealsForDate,
  sumSavedMealTotals,
  todayIsoDate,
  useMealLogStore,
} from '../../store/mealLogStore'

type Props = {
  phaseKcal: number | null
  targetProtein: number | null
  onJumpToBuilder: () => void
  onFocusSlot: (slot: MealSlot) => void
}

type BarSegments = {
  baseLogged: number
  thisMeal: number
  remaining: number
}

function segmentWidths(logged: number, meal: number, target: number | null): BarSegments {
  if (target == null || target <= 0) {
    return { baseLogged: 0, thisMeal: 0, remaining: 100 }
  }
  const loggedPct = Math.min(100, (logged / target) * 100)
  const projected = logged + meal
  const projectedPct = Math.min(100, (projected / target) * 100)
  const mealPct = Math.max(0, projectedPct - loggedPct)
  return {
    baseLogged: loggedPct,
    thisMeal: mealPct,
    remaining: Math.max(0, 100 - loggedPct - mealPct),
  }
}

/** Sticky day-aware read-out: today's logged meals + the plate in progress vs. phase target. */
export function PlatePageSummary({ phaseKcal, targetProtein, onJumpToBuilder, onFocusSlot }: Props) {
  const template = usePlateBuilderStore((s) => s.template)
  const items = usePlateBuilderStore((s) => s.items)

  const mealTotals = useMemo(() => sumMacros(items), [items])

  const meals = useMealLogStore((s) => s.meals)
  const today = todayIsoDate()
  const todays = useMemo(() => mealsForDate(meals, today), [meals, today])
  const dayTotals = useMemo(() => sumSavedMealTotals(todays), [todays])

  const projectedKcal = dayTotals.kcal + mealTotals.kcal
  const projectedProtein = dayTotals.p + mealTotals.p

  const kcalSegs = segmentWidths(dayTotals.kcal, mealTotals.kcal, phaseKcal)
  const proteinSegs = segmentWidths(dayTotals.p, mealTotals.p, targetProtein)

  const kcalPct =
    phaseKcal != null && phaseKcal > 0 ? Math.round((projectedKcal / phaseKcal) * 100) : null
  const proteinPct =
    targetProtein != null && targetProtein > 0
      ? Math.round((projectedProtein / targetProtein) * 100)
      : null

  const kcalState =
    phaseKcal == null
      ? 'idle'
      : projectedKcal === 0
        ? 'idle'
        : kcalPct != null && kcalPct > 110
          ? 'over'
          : kcalPct != null && kcalPct >= 80
            ? 'ontrack'
            : 'low'

  const proteinState =
    targetProtein == null
      ? 'idle'
      : projectedProtein === 0
        ? 'idle'
        : proteinPct != null && proteinPct >= 100
          ? 'met'
          : proteinPct != null && proteinPct >= 70
            ? 'close'
            : 'low'

  const slots = slotsForTemplate(template)
  const filledSet = useMemo(() => new Set(items.map((it) => it.slot)), [items])
  const filledCount = slots.reduce((n, s) => (filledSet.has(s) ? n + 1 : n), 0)

  const empty = items.length === 0
  const hasLogged = todays.length > 0

  const barAriaText = (logged: number, meal: number, target: number | null, unit: string) => {
    if (target == null) return `Target unset`
    const parts: string[] = []
    if (logged > 0) parts.push(`${Math.round(logged)}${unit} already logged today`)
    if (meal > 0) parts.push(`${Math.round(meal)}${unit} on this plate`)
    parts.push(`target ${target}${unit}`)
    return parts.join(', ')
  }

  return (
    <section className="plate-page-summary" aria-label="Plate summary">
      <div className="plate-page-summary__row">
        <div
          className={`plate-page-summary__metric plate-page-summary__metric--kcal is-${kcalState}`}
        >
          <div className="plate-page-summary__metric-head">
            <span className="plate-page-summary__metric-label">Calories</span>
            <span className="plate-page-summary__metric-value">
              <strong>{Math.round(projectedKcal)}</strong>
              {phaseKcal != null ? <span className="muted"> / {phaseKcal}</span> : null}
              {kcalPct != null ? (
                <span className="plate-page-summary__pct">{kcalPct}%</span>
              ) : null}
            </span>
          </div>
          <div
            className="plate-page-summary__bar plate-page-summary__bar--stacked"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(kcalSegs.baseLogged + kcalSegs.thisMeal)}
            aria-valuetext={barAriaText(dayTotals.kcal, mealTotals.kcal, phaseKcal, ' kcal')}
          >
            <span
              className="plate-page-summary__bar-seg plate-page-summary__bar-seg--logged"
              style={{ width: `${kcalSegs.baseLogged}%` }}
            />
            <span
              className="plate-page-summary__bar-seg plate-page-summary__bar-seg--meal"
              style={{ width: `${kcalSegs.thisMeal}%` }}
            />
          </div>
        </div>

        <div
          className={`plate-page-summary__metric plate-page-summary__metric--protein is-${proteinState}`}
        >
          <div className="plate-page-summary__metric-head">
            <span className="plate-page-summary__metric-label">Protein</span>
            <span className="plate-page-summary__metric-value">
              <strong>{Math.round(projectedProtein)}g</strong>
              {targetProtein != null ? (
                <span className="muted"> / {targetProtein}g</span>
              ) : null}
              {proteinPct != null ? (
                <span className="plate-page-summary__pct">{proteinPct}%</span>
              ) : null}
            </span>
          </div>
          <div
            className="plate-page-summary__bar plate-page-summary__bar--stacked"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(proteinSegs.baseLogged + proteinSegs.thisMeal)}
            aria-valuetext={barAriaText(dayTotals.p, mealTotals.p, targetProtein, ' g')}
          >
            <span
              className="plate-page-summary__bar-seg plate-page-summary__bar-seg--logged"
              style={{ width: `${proteinSegs.baseLogged}%` }}
            />
            <span
              className="plate-page-summary__bar-seg plate-page-summary__bar-seg--meal"
              style={{ width: `${proteinSegs.thisMeal}%` }}
            />
          </div>
        </div>

        <div className="plate-page-summary__macros" role="group" aria-label="This plate macros">
          <span className="plate-page-summary__macro" title="Carbs on this plate (g)">
            <span className="muted">C</span>
            <strong>{Math.round(mealTotals.c)}</strong>
          </span>
          <span className="plate-page-summary__macro" title="Fat on this plate (g)">
            <span className="muted">F</span>
            <strong>{Math.round(mealTotals.f)}</strong>
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

      {hasLogged ? (
        <div className="plate-page-summary__foot">
          <span className="muted">
            Calories: {Math.round(dayTotals.kcal)} logged · +{Math.round(mealTotals.kcal)} on plate
          </span>
          <span className="muted">
            Protein: {Math.round(dayTotals.p)}g logged · +{Math.round(mealTotals.p)}g on plate
          </span>
        </div>
      ) : null}

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
