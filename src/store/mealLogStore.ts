import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  HealthFocus,
  MealLineItem,
  MealTemplate,
} from '../domain/plateMeal'
import { newLineId, sumMacros } from '../domain/plateMeal'
import type { SavedMeal } from '../types/savedMeal'

export const MEAL_LOG_STORAGE_KEY = 'vat_meal_log_v1'

interface MealLogStore {
  meals: SavedMeal[]
  /**
   * Snapshot the current builder state into a saved meal for `date`.
   * Returns the new entry's id so callers can show a "saved" toast and
   * optionally let the user undo.
   */
  saveMeal: (input: {
    date: string
    template: MealTemplate
    healthFocus: HealthFocus
    items: MealLineItem[]
  }) => SavedMeal
  /** Remove a single saved meal. No-op if id is unknown. */
  removeMeal: (id: string) => void
  /** Drop everything. Used by tests and a future "Clear meal log" affordance. */
  clearAll: () => void
}

/**
 * Build the human label shown in the meal-log list. Short and scannable so
 * a row reads like a tweet: template + line count + kcal.
 */
export function buildSavedMealLabel(input: {
  template: MealTemplate
  itemCount: number
  kcal: number
}): string {
  const templateLabel: Record<MealTemplate, string> = {
    rest: 'Rest plate',
    training: 'Training plate',
    soup: 'Soup bowl',
  }
  const lineWord = input.itemCount === 1 ? 'line' : 'lines'
  return `${templateLabel[input.template]} · ${input.itemCount} ${lineWord} · ${input.kcal} kcal`
}

/** ISO date string (YYYY-MM-DD) for "now" in the user's local timezone. */
export function todayIsoDate(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10)
}

/**
 * Sort by save time, newest first. Saves don't necessarily come in chronological
 * order (loading from storage, undo/redo) so we always normalize the array on write.
 */
function sortMealsNewestFirst(meals: SavedMeal[]): SavedMeal[] {
  return [...meals].sort((a, b) => b.savedAt.localeCompare(a.savedAt))
}

export const useMealLogStore = create<MealLogStore>()(
  persist(
    (set, get) => ({
      meals: [],

      saveMeal: ({ date, template, healthFocus, items }) => {
        const totals = sumMacros(items)
        const rounded = {
          kcal: Math.round(totals.kcal),
          p: Math.round(totals.p * 10) / 10,
          f: Math.round(totals.f * 10) / 10,
          c: Math.round(totals.c * 10) / 10,
        }
        const entry: SavedMeal = {
          id: newLineId(),
          savedAt: new Date().toISOString(),
          date,
          label: buildSavedMealLabel({
            template,
            itemCount: items.length,
            kcal: rounded.kcal,
          }),
          template,
          healthFocus,
          /** Deep-ish copy: items themselves are leaf objects from the builder store. */
          items: items.map((it) => ({
            ...it,
            foodSnapshot: it.foodSnapshot ? { ...it.foodSnapshot } : undefined,
            custom: it.custom ? { ...it.custom } : undefined,
          })),
          totals: rounded,
        }
        set({ meals: sortMealsNewestFirst([...get().meals, entry]) })
        return entry
      },

      removeMeal: (id) => {
        set({ meals: get().meals.filter((m) => m.id !== id) })
      },

      clearAll: () => set({ meals: [] }),
    }),
    {
      name: MEAL_LOG_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ meals: s.meals }),
    },
  ),
)

/**
 * Selector: meals on a given calendar date, newest first. Pass `useMealLogStore`'s
 * `meals` slice in to keep this pure and easy to test.
 */
export function mealsForDate(meals: SavedMeal[], date: string): SavedMeal[] {
  return meals.filter((m) => m.date === date)
}

/** Aggregate kcal + macros across a list of saved meals. */
export function sumSavedMealTotals(meals: SavedMeal[]): {
  kcal: number
  p: number
  f: number
  c: number
} {
  return meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.totals.kcal,
      p: acc.p + m.totals.p,
      f: acc.f + m.totals.f,
      c: acc.c + m.totals.c,
    }),
    { kcal: 0, p: 0, f: 0, c: 0 },
  )
}
