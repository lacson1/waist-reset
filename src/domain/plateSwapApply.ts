import type { PlateSwapRow } from '../data/plateContent'
import type { MealSlot, MealTemplate } from './plateMeal'

/** Rough illustrative macros for a single swap suggestion (user can edit on the worksheet). */
const SWAP_ROLE_MACROS: Record<
  string,
  { kcal: number; p: number; f: number; c: number }
> = {
  'Leafy green': { kcal: 40, p: 3.5, f: 0.5, c: 7 },
  'Lean protein': { kcal: 170, p: 28, f: 6, c: 1 },
  'Slow carb': { kcal: 130, p: 5, f: 1.5, c: 24 },
  'Healthy fat': { kcal: 90, p: 0.5, f: 10, c: 0 },
  Thermogenic: { kcal: 8, p: 0.5, f: 0, c: 1.5 },
  'Probiotic / umami': { kcal: 25, p: 2, f: 0.5, c: 3 },
  'Fermented dairy': { kcal: 110, p: 12, f: 3, c: 9 },
  'Hydration anchor': { kcal: 6, p: 0, f: 0, c: 1.5 },
}

/**
 * Maps a food-swap "role" row to a builder wedge for the active template.
 * Drink-style rows use the closest wedge so the line still shows on the diagram.
 */
export function mapSwapRowSlotToMealSlot(
  row: PlateSwapRow,
  template: MealTemplate,
): MealSlot | null {
  const key = row.slot
  switch (key) {
    case 'Leafy green':
      return template === 'soup' ? 'leafy' : 'veg'
    case 'Lean protein':
      return 'protein'
    case 'Slow carb':
      if (template === 'rest') return 'fibre'
      if (template === 'training') return 'carbs'
      return 'base'
    case 'Healthy fat':
      if (template === 'soup') return 'optional'
      return 'veg'
    case 'Thermogenic':
      return template === 'soup' ? 'aromatics' : 'veg'
    case 'Probiotic / umami':
      return template === 'soup' ? 'aromatics' : 'veg'
    case 'Fermented dairy':
      return 'protein'
    case 'Hydration anchor':
      if (template === 'soup') return 'optional'
      if (template === 'rest') return 'fibre'
      return 'carbs'
    default:
      return null
  }
}

export function swapReferenceMacros(row: PlateSwapRow): {
  kcal: number
  p: number
  f: number
  c: number
} {
  return SWAP_ROLE_MACROS[row.slot] ?? { kcal: 50, p: 3, f: 2, c: 6 }
}

export type SwapVariant = 'western' | 'african'

export function buildSwapCustomLine(
  row: PlateSwapRow,
  variant: SwapVariant,
  template: MealTemplate,
): { slot: MealSlot; label: string; kcal: number; p: number; f: number; c: number } | null {
  const slot = mapSwapRowSlotToMealSlot(row, template)
  if (slot == null) return null
  const text = variant === 'western' ? row.western : row.african
  const label = `${variant === 'western' ? 'Western' : 'African'} · ${row.slot}: ${text}`
  const m = swapReferenceMacros(row)
  return { slot, label, ...m }
}
