import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  mealsForDate,
  sumSavedMealTotals,
  todayIsoDate,
  useMealLogStore,
} from '../../store/mealLogStore'

/**
 * Card on the Today page that lists meals saved from the Plate builder for the
 * current calendar day. Always rendered (even when empty) so the affordance
 * stays discoverable; an empty state nudges the user to the Plate page rather
 * than the card silently disappearing.
 */
export function TodayMealsCard() {
  const meals = useMealLogStore((s) => s.meals)
  const removeMeal = useMealLogStore((s) => s.removeMeal)
  const today = todayIsoDate()
  const todays = useMemo(() => mealsForDate(meals, today), [meals, today])
  const totals = useMemo(() => sumSavedMealTotals(todays), [todays])

  return (
    <div className="card today-meals-card" data-testid="today-meals-card">
      <div className="today-meals-card__head">
        <div className="section-title">Today&apos;s meals</div>
        {todays.length > 0 && (
          <span className="chip teal" data-testid="today-meals-total-kcal">
            {totals.kcal} kcal · {Math.round(totals.p)} g protein
          </span>
        )}
      </div>

      {todays.length === 0 ? (
        <p className="today-meals-card__empty">
          No meals saved for today yet.{' '}
          <Link to="/plate">Open the Plate builder</Link> and tap{' '}
          <strong>Save to today</strong> when a meal is ready.
        </p>
      ) : (
        <ul className="today-meals-card__list">
          {todays.map((meal) => {
            const time = meal.savedAt
              ? new Date(meal.savedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''
            return (
              <li
                key={meal.id}
                className="today-meals-card__row"
                data-testid="today-meals-row"
              >
                <div className="today-meals-card__row-main">
                  <div className="today-meals-card__row-title">{meal.label}</div>
                  <div className="today-meals-card__row-meta">
                    {time && <span>{time}</span>}
                    <span>P {Math.round(meal.totals.p)} g</span>
                    <span>F {Math.round(meal.totals.f)} g</span>
                    <span>C {Math.round(meal.totals.c)} g</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeMeal(meal.id)}
                  aria-label={`Remove ${meal.label}`}
                  data-testid="today-meals-remove"
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
