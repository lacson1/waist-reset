import type {
  HealthFocus,
  MealLineItem,
  MealTemplate,
} from '../domain/plateMeal'

/**
 * A meal logged to a specific calendar day.
 *
 * SavedMeal is intentionally a *snapshot* — it copies the full builder state
 * (template, focus, items, totals) at save time so the entry stays readable
 * even if the builder schema or the foods database evolves later. A user
 * looking back a month from now should see what they actually ate, not a
 * recomputation against today's data.
 */
export interface SavedMeal {
  id: string
  /** ISO 8601 timestamp; when the user pressed Save. */
  savedAt: string
  /** ISO date string `YYYY-MM-DD`; the calendar day this meal belongs to. */
  date: string
  /** Human label, auto-derived (e.g. "Rest plate · 3 lines · 412 kcal"). */
  label: string
  template: MealTemplate
  healthFocus: HealthFocus
  /** Frozen copy of the lines at save time. */
  items: MealLineItem[]
  /** Frozen totals at save time so we never recompute against drifting foods. */
  totals: { kcal: number; p: number; f: number; c: number }
}
