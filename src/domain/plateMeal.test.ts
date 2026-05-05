import { describe, expect, it } from 'vitest'
import {
  fatKcalShare,
  isHealthFocus,
  mealFocusNarrative,
  platePickLabelForDiagram,
  scaledFoodQtyLabel,
  scaledMacros,
  slotLabel,
  slotPickLinesForTemplate,
  sumMacros,
  type MealLineItem,
} from './plateMeal'

function foodLine(portion: number, kcal: number, p: number, f: number, c: number): MealLineItem {
  return {
    id: 'food-1',
    slot: 'veg',
    source: 'food',
    portion,
    foodSnapshot: {
      n: 'Fixture food',
      b: 'General',
      t: 'veg',
      qty: '100g',
      kcal,
      p,
      f,
      c,
    },
  }
}

function customLine(portion: number, kcal: number, p: number, f: number, c: number): MealLineItem {
  return {
    id: 'custom-1',
    slot: 'protein',
    source: 'custom',
    portion,
    custom: { label: 'Custom line', kcal, p, f, c },
  }
}

describe('scaledMacros', () => {
  it('scales food snapshot kcal (rounded) and macros to one decimal', () => {
    const row = foodLine(2, 37, 3, 0.5, 4)
    expect(scaledMacros(row)).toEqual({ kcal: 74, p: 6, f: 1, c: 8 })
  })

  it('matches UI line kcal formula Math.round(base * portion)', () => {
    const row = foodLine(2.5, 40, 10, 4, 20)
    const { kcal } = scaledMacros(row)
    expect(kcal).toBe(Math.round(40 * 2.5))
    expect(kcal).toBe(100)
  })

  it('scales custom lines the same way', () => {
    const row = customLine(1.5, 100, 12, 8, 24)
    expect(scaledMacros(row)).toEqual({ kcal: 150, p: 18, f: 12, c: 36 })
  })

  it('returns zeros when custom snapshot is missing', () => {
    const row: MealLineItem = {
      id: 'x',
      slot: 'veg',
      source: 'custom',
      portion: 2,
    }
    expect(scaledMacros(row)).toEqual({ kcal: 0, p: 0, f: 0, c: 0 })
  })
})

describe('sumMacros', () => {
  it('sums scaled rows so totals match sum of per-line portions', () => {
    const items: MealLineItem[] = [
      foodLine(1, 50, 5, 2, 8),
      customLine(2, 25, 2.5, 1, 4),
    ]
    expect(sumMacros(items)).toEqual({ kcal: 100, p: 10, f: 4, c: 16 })
  })
})

describe('scaledFoodQtyLabel', () => {
  it('returns reference qty unchanged at portion 1', () => {
    expect(scaledFoodQtyLabel('2 large', 1)).toBe('2 large')
    expect(scaledFoodQtyLabel('2 large', 1.00001)).toBe('2 large')
  })

  it('scales leading count for eggs-style qty', () => {
    expect(scaledFoodQtyLabel('2 large', 2)).toBe('4 large')
    expect(scaledFoodQtyLabel('2 large', 1.5)).toBe('3 large')
  })

  it('scales leading grams', () => {
    expect(scaledFoodQtyLabel('130g', 2)).toBe('260g')
    expect(scaledFoodQtyLabel('100g', 0.5)).toBe('50g')
  })

  it('appends ×portion when qty has no leading number', () => {
    expect(scaledFoodQtyLabel('Half fillet', 2)).toBe('Half fillet ×2.0')
  })
})

describe('isHealthFocus', () => {
  it('accepts known ids', () => {
    expect(isHealthFocus('lipid_heart')).toBe(true)
    expect(isHealthFocus('weight')).toBe(true)
  })

  it('rejects unknown strings', () => {
    expect(isHealthFocus('cholesterol')).toBe(false)
    expect(isHealthFocus(null)).toBe(false)
  })
})

describe('fatKcalShare', () => {
  it('returns 0 when kcal is 0', () => {
    expect(fatKcalShare({ kcal: 0, f: 10 })).toBe(0)
  })

  it('computes fat as share of meal kcal', () => {
    // 10g fat = 90 kcal of 200 kcal => 45%
    expect(fatKcalShare({ kcal: 200, f: 10 })).toBe(45)
  })
})

describe('mealFocusNarrative', () => {
  it('returns lines for lipid_heart focus', () => {
    const lines = mealFocusNarrative(
      'lipid_heart',
      { kcal: 400, p: 30, f: 15, c: 40 },
      { kcalTotal: 400, proteinTotal: 30, pctOfDayKcal: 25, proteinVsTargetRatio: 60 },
      null,
    )
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.some((l) => l.includes('fat'))).toBe(true)
  })
})

describe('slotLabel', () => {
  it('renames "veg" inside a soup bowl', () => {
    expect(slotLabel('soup', 'veg')).toBe('Leafy / veg')
  })

  it('keeps "Vegetables" on rest and training plates', () => {
    expect(slotLabel('rest', 'veg')).toBe('Vegetables')
    expect(slotLabel('training', 'veg')).toBe('Vegetables')
  })

  it('labels training-only and soup-only slots', () => {
    expect(slotLabel('training', 'carbs')).toBe('Slow carbs')
    expect(slotLabel('soup', 'aromatics')).toBe('Aromatics')
    expect(slotLabel('soup', 'leafy')).toBe('Leafy volume')
    expect(slotLabel('soup', 'optional')).toBe('Optional')
  })
})

describe('platePickLabelForDiagram', () => {
  it('keeps short names with portion suffix', () => {
    const row = foodLine(2, 50, 5, 2, 8)
    expect(platePickLabelForDiagram(row)).toBe('Fixture food ×2')
  })

  it('keeps the full food name and portion on the diagram string (wrap happens in SVG)', () => {
    const row: MealLineItem = {
      id: 'long',
      slot: 'veg',
      source: 'food',
      portion: 2.5,
      foodSnapshot: {
        n: 'Super long prepared food name with many words',
        b: 'General',
        t: 'veg',
        qty: '100g',
        kcal: 40,
        p: 4,
        f: 1,
        c: 6,
      },
    }
    expect(platePickLabelForDiagram(row)).toBe('Super long prepared food name with many words ×2.5')
  })

  it('keeps portion suffix visible when the name is short', () => {
    const row: MealLineItem = {
      id: 'short',
      slot: 'veg',
      source: 'food',
      portion: 2.5,
      foodSnapshot: {
        n: 'Egg',
        b: 'General',
        t: 'veg',
        qty: '1',
        kcal: 70,
        p: 6,
        f: 5,
        c: 0,
      },
    }
    expect(platePickLabelForDiagram(row)).toBe('Egg ×2.5')
  })

  it('omits portion suffix at ~1', () => {
    expect(platePickLabelForDiagram(foodLine(1, 50, 5, 2, 8))).toBe('Fixture food')
  })
})

describe('slotPickLinesForTemplate', () => {
  it('caps picks per slot and carries food type for glyphs', () => {
    const items: MealLineItem[] = [
      { ...foodLine(1, 10, 1, 0, 0), id: 'a', slot: 'veg' },
      { ...foodLine(1, 10, 1, 0, 0), id: 'b', slot: 'veg' },
      { ...foodLine(1, 10, 1, 0, 0), id: 'c', slot: 'veg' },
      { ...foodLine(1, 10, 1, 0, 0), id: 'd', slot: 'veg' },
    ]
    const picks = slotPickLinesForTemplate('rest', items)
    expect(picks.veg).toHaveLength(3)
    expect(picks.veg[0]?.type).toBe('veg')
  })
})

describe('portion clamp (mirrors plateBuilderStore.setPortion)', () => {
  const clamp = (portion: number) => Math.max(0.1, Math.min(10, portion))

  it('clamps high to 10', () => {
    expect(clamp(15)).toBe(10)
  })

  it('clamps low to 0.1', () => {
    expect(clamp(0)).toBe(0.1)
    expect(clamp(0.05)).toBe(0.1)
  })
})
