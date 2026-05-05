import { describe, expect, it } from 'vitest'
import type { FoodRow } from './foods'
import {
  foodCatLabel,
  foodMatchesSlot,
  inferFoodCat,
  isFoodCat,
  slotAcceptedCats,
} from './foodCategory'

function row(partial: Partial<FoodRow> & Pick<FoodRow, 'n'>): FoodRow {
  return {
    b: 'General',
    t: 'Protein',
    qty: '100g',
    kcal: 100,
    p: 10,
    f: 3,
    c: 5,
    ...partial,
  }
}

describe('isFoodCat', () => {
  it('accepts known cats', () => {
    expect(isFoodCat('fish')).toBe(true)
    expect(isFoodCat('leafy')).toBe(true)
    expect(isFoodCat('grain')).toBe(true)
  })

  it('rejects unknown values', () => {
    expect(isFoodCat('vegetable')).toBe(false)
    expect(isFoodCat('')).toBe(false)
    expect(isFoodCat(null)).toBe(false)
    expect(isFoodCat(undefined)).toBe(false)
  })
})

describe('inferFoodCat', () => {
  it('uses the row.cat when present and valid', () => {
    expect(inferFoodCat(row({ n: 'African catfish', cat: 'fish' }))).toBe('fish')
    expect(inferFoodCat(row({ n: 'Whatever', cat: 'tuber' }))).toBe('tuber')
  })

  it('falls back to name-based inference when cat is missing', () => {
    expect(inferFoodCat(row({ n: 'African catfish' }))).toBe('fish')
    expect(inferFoodCat(row({ n: 'Sardines' }))).toBe('fish')
    expect(inferFoodCat(row({ n: 'Spinach' }))).toBe('leafy')
    expect(inferFoodCat(row({ n: 'Lentils' }))).toBe('legume')
    expect(inferFoodCat(row({ n: 'Sweet potato' }))).toBe('tuber')
    expect(inferFoodCat(row({ n: 'Walnuts' }))).toBe('nut')
    expect(inferFoodCat(row({ n: 'Chia seeds' }))).toBe('seed')
    expect(inferFoodCat(row({ n: 'EVOO' }))).toBe('fat')
  })

  it('falls back to type-based inference when name is unknown', () => {
    expect(inferFoodCat(row({ n: 'Mystery food', t: 'Protein' }))).toBe('meat')
    expect(inferFoodCat(row({ n: 'Mystery food', t: 'Leafy Volume' }))).toBe('leafy')
    expect(inferFoodCat(row({ n: 'Mystery food', t: 'Volume' }))).toBe('veg')
    expect(inferFoodCat(row({ n: 'Mystery food', t: 'Fat Quality' }))).toBe('fat')
  })

  it('ignores invalid cat values and falls back', () => {
    expect(inferFoodCat(row({ n: 'African catfish', cat: 'bogus' }))).toBe('fish')
  })
})

describe('foodCatLabel', () => {
  it('renders human-readable labels', () => {
    expect(foodCatLabel('fish')).toBe('Fish')
    expect(foodCatLabel('leafy')).toBe('Leafy green')
    expect(foodCatLabel('fibre-supplement')).toBe('Fibre supplement')
  })
})

describe('slotAcceptedCats', () => {
  it('keeps proteins out of the rest-day vegetables wedge', () => {
    const accepted = slotAcceptedCats('rest', 'veg') ?? []
    expect(accepted).not.toContain('fish')
    expect(accepted).not.toContain('meat')
    expect(accepted).toContain('veg')
    expect(accepted).toContain('leafy')
  })

  it('puts grains and tubers on the training-day carbs wedge', () => {
    const accepted = slotAcceptedCats('training', 'carbs') ?? []
    expect(accepted).toEqual(expect.arrayContaining(['grain', 'tuber', 'legume']))
    expect(accepted).not.toContain('leafy')
  })

  it('returns null for soup "optional" (flexible slot)', () => {
    expect(slotAcceptedCats('soup', 'optional')).toBeNull()
  })

  it('limits soup leafy slot to leafy greens only', () => {
    expect(slotAcceptedCats('soup', 'leafy')).toEqual(['leafy'])
  })
})

describe('foodMatchesSlot', () => {
  it('rejects African catfish on a Vegetables wedge', () => {
    const catfish = row({ n: 'African catfish', t: 'Protein Dense', cat: 'fish' })
    expect(foodMatchesSlot(catfish, 'rest', 'veg')).toBe(false)
    expect(foodMatchesSlot(catfish, 'training', 'veg')).toBe(false)
  })

  it('accepts African catfish on a Protein wedge', () => {
    const catfish = row({ n: 'African catfish', t: 'Protein Dense', cat: 'fish' })
    expect(foodMatchesSlot(catfish, 'rest', 'protein')).toBe(true)
    expect(foodMatchesSlot(catfish, 'training', 'protein')).toBe(true)
    expect(foodMatchesSlot(catfish, 'soup', 'protein')).toBe(true)
  })

  it('accepts spinach as both veg (rest/training) and leafy (soup)', () => {
    const spinach = row({ n: 'Spinach', t: 'Fibre', cat: 'leafy' })
    expect(foodMatchesSlot(spinach, 'rest', 'veg')).toBe(true)
    expect(foodMatchesSlot(spinach, 'training', 'veg')).toBe(true)
    expect(foodMatchesSlot(spinach, 'soup', 'leafy')).toBe(true)
  })

  it('keeps oats off the rest-day fibre wedge but accepts on training carbs', () => {
    const oats = row({ n: 'Oats', t: 'Fibre', cat: 'grain' })
    expect(foodMatchesSlot(oats, 'rest', 'fibre')).toBe(false)
    expect(foodMatchesSlot(oats, 'training', 'carbs')).toBe(true)
  })

  it('always accepts foods on the soup "optional" wedge', () => {
    const evoo = row({ n: 'EVOO', t: 'Fat Quality', cat: 'fat' })
    expect(foodMatchesSlot(evoo, 'soup', 'optional')).toBe(true)
  })
})
