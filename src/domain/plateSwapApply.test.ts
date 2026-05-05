import { describe, expect, it } from 'vitest'
import type { PlateSwapRow } from '../data/plateContent'
import { mapSwapRowSlotToMealSlot, buildSwapCustomLine } from './plateSwapApply'

function row(overrides: Partial<PlateSwapRow> & Pick<PlateSwapRow, 'slot'>): PlateSwapRow {
  return {
    category: 'plate-core',
    western: 'W',
    african: 'A',
    why: 'why',
    ...overrides,
  }
}

describe('mapSwapRowSlotToMealSlot', () => {
  it('maps leafy to veg or leafy', () => {
    const r = row({ slot: 'Leafy green' })
    expect(mapSwapRowSlotToMealSlot(r, 'rest')).toBe('veg')
    expect(mapSwapRowSlotToMealSlot(r, 'training')).toBe('veg')
    expect(mapSwapRowSlotToMealSlot(r, 'soup')).toBe('leafy')
  })

  it('maps slow carb by template', () => {
    const r = row({ slot: 'Slow carb' })
    expect(mapSwapRowSlotToMealSlot(r, 'rest')).toBe('fibre')
    expect(mapSwapRowSlotToMealSlot(r, 'training')).toBe('carbs')
    expect(mapSwapRowSlotToMealSlot(r, 'soup')).toBe('base')
  })

  it('maps hydration by template', () => {
    const r = row({ slot: 'Hydration anchor' })
    expect(mapSwapRowSlotToMealSlot(r, 'rest')).toBe('fibre')
    expect(mapSwapRowSlotToMealSlot(r, 'training')).toBe('carbs')
    expect(mapSwapRowSlotToMealSlot(r, 'soup')).toBe('optional')
  })
})

describe('buildSwapCustomLine', () => {
  it('returns a labelled custom row for western', () => {
    const r: PlateSwapRow = {
      category: 'plate-core',
      slot: 'Lean protein',
      western: 'Chicken',
      african: 'Goat',
      why: 'x',
    }
    const line = buildSwapCustomLine(r, 'western', 'rest')
    expect(line?.slot).toBe('protein')
    expect(line?.label).toContain('Western')
    expect(line?.label).toContain('Chicken')
    expect(line?.kcal).toBeGreaterThan(0)
  })
})
