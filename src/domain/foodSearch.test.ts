import { describe, expect, it } from 'vitest'
import type { FoodRow } from './foods'
import {
  filterAndSortFoods,
  foodFitsSlot,
  groupFoodsByKind,
  partitionFoodMatchesBySlot,
  searchFoodRows,
  SLOT_FOOD_KIND_AFFINITY,
  type FoodSearchFilters,
} from './foodSearch'

const rows: FoodRow[] = [
  {
    n: 'Spinach',
    b: 'General',
    t: 'veg',
    qty: '120g',
    kcal: 28,
    p: 3,
    f: 0.4,
    c: 2,
    mech: 'Leafy greens',
  },
  {
    n: 'Greek yoghurt',
    b: 'General',
    t: 'Protein',
    qty: '150g',
    kcal: 150,
    p: 15,
    f: 8,
    c: 5,
    mech: 'Fermented dairy protein',
  },
  {
    n: 'Green tea',
    b: 'General',
    t: 'Drink',
    qty: '3–4 cups',
    kcal: 0,
    p: 0,
    f: 0,
    c: 0,
  },
]

describe('searchFoodRows', () => {
  it('returns empty for blank query', () => {
    expect(searchFoodRows(rows, '', 10)).toEqual([])
    expect(searchFoodRows(rows, '   ', 10)).toEqual([])
  })

  it('matches single token on name', () => {
    const r = searchFoodRows(rows, 'spinach', 10)
    expect(r.map((x) => x.n)).toEqual(['Spinach'])
  })

  it('requires all tokens (multi-word)', () => {
    const r = searchFoodRows(rows, 'greek yoghurt', 10)
    expect(r.map((x) => x.n)).toEqual(['Greek yoghurt'])
    expect(searchFoodRows(rows, 'greek spinach', 10)).toEqual([])
  })

  it('matches evidence field ev', () => {
    const withEv: FoodRow[] = [
      {
        n: 'Zobo marker',
        b: 'General',
        t: 'Volume',
        qty: '1 cup',
        kcal: 1,
        p: 0,
        f: 0,
        c: 0,
        ev: 'Meta-analysis of cohort studies on waist',
      },
    ]
    expect(searchFoodRows(withEv, 'meta-analysis', 5).map((r) => r.n)).toEqual([
      'Zobo marker',
    ])
  })

  it('ranks name match above mechanism-only match', () => {
    const many: FoodRow[] = [
      ...rows,
      {
        n: 'Rice',
        b: 'General',
        t: 'carb',
        qty: '100g',
        kcal: 130,
        p: 3,
        f: 0,
        c: 28,
        mech: 'Spinach pairs well with lemon',
      },
    ]
    const r = searchFoodRows(many, 'spinach', 5)
    expect(r[0]?.n).toBe('Spinach')
  })
})

const richRows: FoodRow[] = [
  { n: 'Sardines', b: 'General', t: 'Protein', cat: 'fish', qty: '120g', kcal: 208, p: 25, f: 11, c: 0 },
  { n: 'Eggs', b: 'General', t: 'Protein', cat: 'egg', qty: '2 large', kcal: 143, p: 13, f: 10, c: 1 },
  { n: 'Spinach', b: 'General', t: 'Fibre', cat: 'leafy', qty: '100g', kcal: 23, p: 3, f: 0.4, c: 1.4 },
  { n: 'Lentils', b: 'General', t: 'Fibre & RS', cat: 'legume', qty: '80g dry', kcal: 270, p: 20, f: 1, c: 28 },
  { n: 'Cucumber', b: 'General', t: 'Volume', cat: 'veg', qty: '150g', kcal: 15, p: 1, f: 0.1, c: 2.6 },
  { n: 'Cayenne', b: 'General', t: 'Thermogenic', cat: 'spice', qty: '½ tsp', kcal: 3, p: 0.1, f: 0.2, c: 0.3 },
  { n: 'EVOO', b: 'General', t: 'Fat Quality', cat: 'fat', qty: '2 tbsp', kcal: 240, p: 0, f: 28, c: 0 },
  { n: 'Sauerkraut', b: 'General', t: 'Volume', cat: 'fermented-veg', qty: '80g', kcal: 14, p: 0.6, f: 0.1, c: 1.8 },
  { n: 'Ogbono', b: 'African', t: 'VAT Powerhouse', cat: 'fibre-supplement', qty: '2 tbsp', kcal: 80, p: 2, f: 7, c: 2 },
  { n: 'Ugu', b: 'African', t: 'Leafy Volume', cat: 'leafy', qty: '100g', kcal: 21, p: 4, f: 0.4, c: 1 },
  { n: 'Stockfish', b: 'African', t: 'Protein Dense', cat: 'fish', qty: '40g dried', kcal: 140, p: 30, f: 2, c: 0 },
  { n: 'Dawadawa', b: 'African', t: 'Fermented & Gut', cat: 'spice', qty: '1 tbsp', kcal: 35, p: 3, f: 2, c: 1 },
]

function baseFilters(overrides: Partial<FoodSearchFilters> = {}): FoodSearchFilters {
  return {
    query: '',
    categories: new Set(),
    branch: 'all',
    fitsSlot: false,
    activeSlot: 'protein',
    sort: 'name',
    ...overrides,
  }
}

describe('foodFitsSlot', () => {
  it('puts proteins on the protein wedge, not vegetables', () => {
    const sardines = richRows[0]!
    expect(foodFitsSlot(sardines, 'protein')).toBe(true)
    expect(foodFitsSlot(sardines, 'veg')).toBe(false)
  })

  it('routes leafy greens to veg/leafy (not fibre)', () => {
    const spinach = richRows[2]!
    expect(foodFitsSlot(spinach, 'veg')).toBe(true)
    expect(foodFitsSlot(spinach, 'leafy')).toBe(true)
    /* spinach is leafy, not legume/seed/nut/fruit — so the rest-day fibre wedge
     * should not claim it. */
    expect(foodFitsSlot(spinach, 'fibre')).toBe(false)
  })

  it('routes legumes to fibre (rest) and carbs (training)', () => {
    const lentils = richRows[3]!
    expect(foodFitsSlot(lentils, 'fibre')).toBe(true)
    expect(foodFitsSlot(lentils, 'carbs')).toBe(true)
    expect(foodFitsSlot(lentils, 'veg')).toBe(false)
  })

  it('treats soup "optional" as always fitting', () => {
    expect(SLOT_FOOD_KIND_AFFINITY.optional).toEqual([])
    expect(foodFitsSlot(richRows[0]!, 'optional')).toBe(true)
    expect(foodFitsSlot(richRows[2]!, 'optional')).toBe(true)
  })

  it('soup aromatics covers spice and powder, not fats or ferments', () => {
    /* Stricter than the legacy mapping: EVOO is a culinary fat, not an
     * aromatic — drizzle it via "optional" instead. */
    const cayenne = richRows[5]!
    const evoo = richRows[6]!
    const dawadawa = richRows[11]!
    expect(foodFitsSlot(cayenne, 'aromatics')).toBe(true)
    expect(foodFitsSlot(dawadawa, 'aromatics')).toBe(true)
    expect(foodFitsSlot(evoo, 'aromatics')).toBe(false)
  })
})

describe('filterAndSortFoods', () => {
  it('filters by branch', () => {
    const out = filterAndSortFoods(richRows, baseFilters({ branch: 'African' }), 100)
    expect(out.every((r) => r.b === 'African')).toBe(true)
    expect(out.length).toBe(4)
  })

  it('filters by category set', () => {
    const out = filterAndSortFoods(
      richRows,
      baseFilters({ categories: new Set(['protein']) }),
      100,
    )
    expect(out.map((r) => r.n).sort()).toEqual(['Eggs', 'Sardines', 'Stockfish'])
  })

  it('fitsSlot scopes to the active slot', () => {
    const out = filterAndSortFoods(
      richRows,
      baseFilters({ fitsSlot: true, activeSlot: 'leafy' }),
      100,
    )
    /* Soup "leafy" wedge is for leafy greens — Spinach is `cat: 'leafy'` and
     * Ugu is jute leaf, both belong. Lentils (legume) and Sauerkraut
     * (fermented-veg) do not. */
    expect(out.map((r) => r.n).sort()).toEqual(['Spinach', 'Ugu'])
  })

  it('ranks by relevance with a query', () => {
    const out = filterAndSortFoods(
      richRows,
      baseFilters({ query: 'eggs', sort: 'relevance' }),
      100,
    )
    expect(out[0]?.n).toBe('Eggs')
  })

  it('sorts kcal asc', () => {
    const out = filterAndSortFoods(richRows, baseFilters({ sort: 'kcal-asc' }), 100)
    const kcal = out.map((r) => r.kcal)
    const sorted = [...kcal].sort((a, b) => a - b)
    expect(kcal).toEqual(sorted)
  })

  it('sorts protein desc', () => {
    const out = filterAndSortFoods(richRows, baseFilters({ sort: 'protein-desc' }), 100)
    expect(out[0]?.n).toBe('Stockfish')
  })

  it('combines branch + category + query', () => {
    const out = filterAndSortFoods(
      richRows,
      baseFilters({ branch: 'African', categories: new Set(['protein']), query: 'stock' }),
      100,
    )
    expect(out.map((r) => r.n)).toEqual(['Stockfish'])
  })
})

describe('partitionFoodMatchesBySlot', () => {
  it('keeps fish out of "matches" when the wedge is for vegetables', () => {
    /* Verifies the user-facing complaint: searching "catfish" while the
     * Vegetables wedge is active must not show African catfish on top. */
    const catfishRow: FoodRow = {
      n: 'African catfish',
      b: 'African',
      t: 'Protein Dense',
      cat: 'fish',
      qty: '150g',
      kcal: 170,
      p: 28,
      f: 6,
      c: 0,
    }
    const broccoliRow: FoodRow = {
      n: 'Broccoli',
      b: 'General',
      t: 'Fibre',
      cat: 'veg',
      qty: '150g',
      kcal: 51,
      p: 4,
      f: 0.5,
      c: 4,
    }
    const acceptedVegCats = ['veg', 'leafy', 'fungus', 'fermented-veg', 'kelp'] as const
    const out = partitionFoodMatchesBySlot(
      [catfishRow, broccoliRow],
      'catfish',
      acceptedVegCats,
    )
    expect(out.matches).toEqual([])
    expect(out.others.map((r) => r.n)).toEqual(['African catfish'])
  })

  it('returns everything as "matches" when acceptedCats is null', () => {
    const out = partitionFoodMatchesBySlot(richRows, 'eggs', null)
    expect(out.matches.length).toBeGreaterThan(0)
    expect(out.others).toEqual([])
  })
})

describe('groupFoodsByKind', () => {
  it('groups rows by category in stable order', () => {
    const groups = groupFoodsByKind(richRows)
    const kinds = groups.map((g) => g.kind)
    expect(kinds).toEqual([
      'protein',
      'fibre',
      'leafy',
      'volume',
      'thermo',
      'fat',
      'ferment',
      'vat',
    ])
  })

  it('sorts alphabetically inside each group and includes every match', () => {
    const groups = groupFoodsByKind(richRows)
    const protein = groups.find((g) => g.kind === 'protein')!
    expect(protein.rows.map((r) => r.n)).toEqual(['Eggs', 'Sardines', 'Stockfish'])
    const volume = groups.find((g) => g.kind === 'volume')!
    expect(volume.rows.map((r) => r.n)).toEqual(['Cucumber', 'Sauerkraut'])
  })
})
