import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  MEAL_LOG_STORAGE_KEY,
  buildSavedMealLabel,
  mealsForDate,
  sumSavedMealTotals,
  todayIsoDate,
  useMealLogStore,
} from './mealLogStore'
import type { MealLineItem } from '../domain/plateMeal'
import type { SavedMeal } from '../types/savedMeal'

function lineFood(
  slot: MealLineItem['slot'],
  food: { n: string; kcal: number; p: number; f: number; c: number },
  portion = 1,
): MealLineItem {
  return {
    id: `food-${food.n}`,
    slot,
    source: 'food',
    foodSnapshot: {
      n: food.n,
      b: 'General',
      t: 'Protein',
      qty: '100g',
      kcal: food.kcal,
      p: food.p,
      f: food.f,
      c: food.c,
    },
    portion,
  }
}

function lineCustom(
  slot: MealLineItem['slot'],
  custom: { label: string; kcal: number; p: number; f: number; c: number },
  portion = 1,
): MealLineItem {
  return {
    id: `custom-${custom.label}`,
    slot,
    source: 'custom',
    custom,
    portion,
  }
}

describe('buildSavedMealLabel', () => {
  it('pluralises lines correctly', () => {
    expect(buildSavedMealLabel({ template: 'rest', itemCount: 1, kcal: 200 })).toBe(
      'Rest plate · 1 line · 200 kcal',
    )
    expect(buildSavedMealLabel({ template: 'rest', itemCount: 3, kcal: 412 })).toBe(
      'Rest plate · 3 lines · 412 kcal',
    )
  })

  it('uses the template-specific noun', () => {
    expect(buildSavedMealLabel({ template: 'training', itemCount: 2, kcal: 600 })).toBe(
      'Training plate · 2 lines · 600 kcal',
    )
    expect(buildSavedMealLabel({ template: 'soup', itemCount: 4, kcal: 320 })).toBe(
      'Soup bowl · 4 lines · 320 kcal',
    )
  })
})

describe('todayIsoDate', () => {
  it('formats YYYY-MM-DD', () => {
    const d = new Date('2026-05-04T12:34:56Z')
    expect(todayIsoDate(d)).toBe('2026-05-04')
  })
})

describe('useMealLogStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useMealLogStore.setState({ meals: [] })
  })

  afterEach(() => {
    useMealLogStore.setState({ meals: [] })
    localStorage.removeItem(MEAL_LOG_STORAGE_KEY)
  })

  it('saveMeal records date + totals + a snapshot of items', () => {
    const items = [
      lineFood('protein', { n: 'Sardines', kcal: 200, p: 25, f: 11, c: 0 }, 1),
      lineCustom('veg', { label: 'Spinach', kcal: 30, p: 3, f: 0.4, c: 1.4 }, 1),
    ]
    const entry = useMealLogStore.getState().saveMeal({
      date: '2026-05-04',
      template: 'rest',
      healthFocus: 'weight',
      items,
    })
    expect(entry.date).toBe('2026-05-04')
    expect(entry.template).toBe('rest')
    expect(entry.totals.kcal).toBe(230)
    expect(entry.totals.p).toBe(28)
    expect(entry.label).toContain('Rest plate')
    expect(entry.label).toContain('230 kcal')
    expect(entry.items).toHaveLength(2)
    expect(useMealLogStore.getState().meals).toHaveLength(1)
  })

  it('saveMeal deep-copies items so later builder edits do not mutate the log', () => {
    const items: MealLineItem[] = [
      lineFood('protein', { n: 'Eggs', kcal: 140, p: 12, f: 10, c: 1 }, 1),
    ]
    const entry = useMealLogStore.getState().saveMeal({
      date: '2026-05-04',
      template: 'training',
      healthFocus: 'weight',
      items,
    })
    /** Mutate the source after save. */
    items[0]!.portion = 5
    items[0]!.foodSnapshot!.n = 'CHANGED'
    expect(entry.items[0]!.portion).toBe(1)
    expect(entry.items[0]!.foodSnapshot!.n).toBe('Eggs')
  })

  it('removeMeal removes the matching entry only', () => {
    const a = useMealLogStore.getState().saveMeal({
      date: '2026-05-04',
      template: 'rest',
      healthFocus: 'weight',
      items: [lineFood('protein', { n: 'A', kcal: 100, p: 10, f: 5, c: 5 })],
    })
    const b = useMealLogStore.getState().saveMeal({
      date: '2026-05-04',
      template: 'rest',
      healthFocus: 'weight',
      items: [lineFood('protein', { n: 'B', kcal: 200, p: 20, f: 5, c: 5 })],
    })
    useMealLogStore.getState().removeMeal(a.id)
    const remaining = useMealLogStore.getState().meals
    expect(remaining).toHaveLength(1)
    expect(remaining[0]!.id).toBe(b.id)
  })

  it('saveMeal returns entries newest first across days', () => {
    /** Order saves with controlled timestamps so the test does not rely on Date.now ticking. */
    const oldEntry: SavedMeal = {
      id: 'old',
      savedAt: '2026-05-03T08:00:00.000Z',
      date: '2026-05-03',
      label: 'old',
      template: 'rest',
      healthFocus: 'weight',
      items: [],
      totals: { kcal: 0, p: 0, f: 0, c: 0 },
    }
    useMealLogStore.setState({ meals: [oldEntry] })
    const fresh = useMealLogStore.getState().saveMeal({
      date: '2026-05-04',
      template: 'soup',
      healthFocus: 'weight',
      items: [lineCustom('base', { label: 'Broth', kcal: 50, p: 3, f: 1, c: 4 })],
    })
    const list = useMealLogStore.getState().meals
    expect(list[0]!.id).toBe(fresh.id)
    expect(list[1]!.id).toBe('old')
  })
})

describe('mealsForDate', () => {
  it('filters by exact date string', () => {
    const meals: SavedMeal[] = [
      { id: '1', savedAt: '', date: '2026-05-04', label: '', template: 'rest', healthFocus: 'weight', items: [], totals: { kcal: 0, p: 0, f: 0, c: 0 } },
      { id: '2', savedAt: '', date: '2026-05-05', label: '', template: 'rest', healthFocus: 'weight', items: [], totals: { kcal: 0, p: 0, f: 0, c: 0 } },
      { id: '3', savedAt: '', date: '2026-05-04', label: '', template: 'rest', healthFocus: 'weight', items: [], totals: { kcal: 0, p: 0, f: 0, c: 0 } },
    ]
    expect(mealsForDate(meals, '2026-05-04').map((m) => m.id)).toEqual(['1', '3'])
  })
})

describe('sumSavedMealTotals', () => {
  it('adds kcal and macros across meals', () => {
    const meals: SavedMeal[] = [
      { id: '1', savedAt: '', date: '', label: '', template: 'rest', healthFocus: 'weight', items: [], totals: { kcal: 200, p: 20, f: 5, c: 10 } },
      { id: '2', savedAt: '', date: '', label: '', template: 'rest', healthFocus: 'weight', items: [], totals: { kcal: 350, p: 25, f: 12, c: 30 } },
    ]
    expect(sumSavedMealTotals(meals)).toEqual({ kcal: 550, p: 45, f: 17, c: 40 })
  })

  it('returns zeros for empty list', () => {
    expect(sumSavedMealTotals([])).toEqual({ kcal: 0, p: 0, f: 0, c: 0 })
  })
})
