import type { FoodRow } from './foods'
import { inferFoodCat, slotAcceptedCats, type FoodCat } from './foodCategory'
import { slotsForTemplate, type MealSlot, type MealTemplate } from './plateMeal'
import { foodTypeKind, type FoodTypeKind } from '../components/plate/FoodTypeIcon'

/** Lowercase + strip combining marks for forgiving match (e.g. résumé vs resume). */
function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function haystack(f: FoodRow): string {
  return normalizeForSearch(
    [f.n, f.b, f.t, f.mech ?? '', f.ev ?? '', f.g ?? '', f.qty, f.r ?? '', f.prep ?? ''].join(
      ' ',
    ),
  )
}

function scoreRow(f: FoodRow, tokens: string[], phrase: string): number | null {
  const h = haystack(f)
  const n = normalizeForSearch(f.n)
  let score = 0
  for (const tok of tokens) {
    if (!h.includes(tok)) return null
    if (n.includes(tok)) {
      score += 85
      if (n.startsWith(tok)) score += 45
      const idx = n.indexOf(tok)
      if (idx > 0) score += Math.max(0, 28 - Math.min(idx, 28))
    }
    const mech = normalizeForSearch(f.mech ?? '')
    if (mech.includes(tok)) score += 18
    const ev = normalizeForSearch(f.ev ?? '')
    if (ev.includes(tok)) score += 14
    if (normalizeForSearch(f.t).includes(tok)) score += 10
    if (normalizeForSearch(f.b).includes(tok)) score += 6
    if (normalizeForSearch(f.qty).includes(tok)) score += 5
  }
  if (tokens.length > 1 && phrase.length >= 3 && n.includes(phrase)) score += 120
  return score
}

/**
 * Ranked substring search: all whitespace-separated tokens must appear somewhere
 * on the row (name, type, mechanism, qty, etc.). Results are sorted by relevance
 * then name.
 */
export function searchFoodRows(
  foods: readonly FoodRow[],
  rawQuery: string,
  limit = 24,
): FoodRow[] {
  const phrase = normalizeForSearch(rawQuery)
  if (!phrase) return []
  const tokens = phrase.split(' ').filter(Boolean)
  if (tokens.length === 0) return []

  const scored: { f: FoodRow; score: number }[] = []
  for (const f of foods) {
    const s = scoreRow(f, tokens, phrase)
    if (s == null) continue
    scored.push({ f, score: s })
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.f.n.localeCompare(b.f.n)
  })
  return scored.slice(0, limit).map((x) => x.f)
}

export interface SlotPartitionedMatches {
  /** Foods whose category matches the active wedge (the natural picks). */
  matches: FoodRow[]
  /** Other foods that match the query but don't belong on the active wedge. */
  others: FoodRow[]
}

/**
 * Run the same ranked search as `searchFoodRows`, then split the result into
 * "matches" (foods that belong on the active wedge) and "others" (everything
 * else). When `acceptedCats` is `null`, the slot is intentionally flexible
 * (e.g. soup "optional"); every result lands in `matches`.
 *
 * `limit` applies *per partition* so a hard-filter UI can show a reasonable
 * number of off-slot suggestions when the user opts to peek beyond the wedge.
 */
export function partitionFoodMatchesBySlot(
  foods: readonly FoodRow[],
  rawQuery: string,
  acceptedCats: readonly FoodCat[] | null,
  limit = 24,
): SlotPartitionedMatches {
  const ranked = searchFoodRows(foods, rawQuery, limit * 2)
  if (acceptedCats === null) {
    return { matches: ranked.slice(0, limit), others: [] }
  }
  const accepted = new Set(acceptedCats)
  const matches: FoodRow[] = []
  const others: FoodRow[] = []
  for (const f of ranked) {
    const target = accepted.has(inferFoodCat(f) as FoodCat) ? matches : others
    if (target.length < limit) target.push(f)
  }
  return { matches, others }
}

// ---------------------------------------------------------------------------
// Filtering, sorting, and slot affinity for the rich Food Search panel.
// ---------------------------------------------------------------------------

export type FoodBranchFilter = 'all' | 'General' | 'African'

export type FoodSortKey = 'relevance' | 'name' | 'kcal-asc' | 'protein-desc'

export interface FoodSearchFilters {
  /** Whitespace-separated tokens, scored by `searchFoodRows`. Empty = browse mode. */
  query: string
  /** Selected category kinds. Empty Set = no category filter. */
  categories: ReadonlySet<FoodTypeKind>
  /** Cuisine branch toggle. */
  branch: FoodBranchFilter
  /** When true, only foods whose category fits the active slot pass. */
  fitsSlot: boolean
  /** Active wedge / slot, used together with `fitsSlot`. */
  activeSlot: MealSlot
  /** Sort key. `relevance` falls back to name when there is no query. */
  sort: FoodSortKey
}

/**
 * Coarse `FoodTypeKind` affinity per wedge — drives the icon-style chip filter
 * and the legacy `fitsSlot` check. The fine-grained source of truth for
 * "does this food belong on the active wedge" is `slotAcceptedCats` /
 * `inferFoodCat` in `foodCategory.ts`; that mapping handles cases like
 * "Lentils have type Fibre but they are a legume, not a vegetable" which
 * `FoodTypeKind` alone can't distinguish. Empty array = no opinion (used by
 * soup `optional`).
 */
export const SLOT_FOOD_KIND_AFFINITY: Record<MealSlot, readonly FoodTypeKind[]> = {
  veg: ['volume', 'fibre', 'leafy'],
  protein: ['protein'],
  fibre: ['fibre'],
  carbs: ['fibre'],
  base: ['volume', 'protein'],
  leafy: ['leafy'],
  aromatics: ['thermo', 'fat', 'ferment'],
  optional: [],
}

/**
 * Whether the food belongs on the wedge. Uses the fine-grained `FoodCat`
 * mapping when the slot has an opinion, falls back to the coarse
 * `SLOT_FOOD_KIND_AFFINITY` only as a safety net for unknown templates.
 *
 * `slot` alone does not carry the template, so we ask `slotAcceptedCats` for
 * the union of accepted cats across all templates that expose this slot
 * (e.g. `protein` is the same set on rest / training / soup, so a single
 * lookup is fine; `veg` differs only in name across templates). When the
 * union resolves to `null` (flexible slot) we accept anything.
 */
export function foodFitsSlot(f: FoodRow, slot: MealSlot): boolean {
  const cats = slotAcceptedCatsForAnyTemplate(slot)
  if (cats === null) {
    const affinity = SLOT_FOOD_KIND_AFFINITY[slot]
    if (!affinity || affinity.length === 0) return true
    return affinity.includes(foodTypeKind(f.t))
  }
  return cats.has(inferFoodCat(f))
}

/**
 * Resolve a single `MealSlot` to the union of accepted `FoodCat`s across
 * all `MealTemplate`s that include that slot. Returns `null` when *any*
 * template treats the slot as flexible (e.g. soup "optional").
 */
function slotAcceptedCatsForAnyTemplate(slot: MealSlot): Set<FoodCat> | null {
  const templates: MealTemplate[] = ['rest', 'training', 'soup']
  const union = new Set<FoodCat>()
  let sawAny = false
  for (const t of templates) {
    const slots = slotsForTemplate(t)
    if (!(slots as readonly string[]).includes(slot)) continue
    sawAny = true
    const cats = slotAcceptedCats(t, slot)
    if (cats === null) return null
    for (const c of cats) union.add(c)
  }
  return sawAny ? union : null
}

function passesNonQueryFilters(f: FoodRow, filters: FoodSearchFilters): boolean {
  if (filters.branch !== 'all' && f.b !== filters.branch) return false
  if (filters.categories.size > 0 && !filters.categories.has(foodTypeKind(f.t))) return false
  if (filters.fitsSlot && !foodFitsSlot(f, filters.activeSlot)) return false
  return true
}

function compareBySort(a: FoodRow, b: FoodRow, sort: FoodSortKey): number {
  switch (sort) {
    case 'kcal-asc':
      if (a.kcal !== b.kcal) return a.kcal - b.kcal
      return a.n.localeCompare(b.n)
    case 'protein-desc':
      if (b.p !== a.p) return b.p - a.p
      return a.n.localeCompare(b.n)
    case 'name':
    case 'relevance':
    default:
      return a.n.localeCompare(b.n)
  }
}

/**
 * Single entry point used by the panel: applies filters first, then either
 * ranks by relevance (when there's a query) or sorts by the requested key.
 * `relevance` falls back to name when there is no query.
 */
export function filterAndSortFoods(
  foods: readonly FoodRow[],
  filters: FoodSearchFilters,
  limit = 60,
): FoodRow[] {
  const pre = foods.filter((f) => passesNonQueryFilters(f, filters))
  const phrase = normalizeForSearch(filters.query)
  if (phrase) {
    const tokens = phrase.split(' ').filter(Boolean)
    if (tokens.length === 0) return []
    const scored: { f: FoodRow; score: number }[] = []
    for (const f of pre) {
      const s = scoreRow(f, tokens, phrase)
      if (s == null) continue
      scored.push({ f, score: s })
    }
    if (filters.sort === 'relevance') {
      scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.f.n.localeCompare(b.f.n)
      })
    } else {
      scored.sort((a, b) => compareBySort(a.f, b.f, filters.sort))
    }
    return scored.slice(0, limit).map((x) => x.f)
  }
  const sorted = [...pre].sort((a, b) => compareBySort(a, b, filters.sort))
  return sorted.slice(0, limit)
}

/**
 * Stable order for category groups in browse mode. Mirrors the order of the
 * filter chip row so eyes don't have to jump around.
 */
export const FOOD_KIND_GROUP_ORDER: readonly FoodTypeKind[] = [
  'protein',
  'fibre',
  'leafy',
  'volume',
  'thermo',
  'fat',
  'ferment',
  'vat',
  'default',
]

export interface FoodKindGroup {
  kind: FoodTypeKind
  rows: FoodRow[]
}

/**
 * Partitions filtered rows into category groups for the browse view, each
 * sorted alphabetically inside the group. Empty groups are dropped. Capping
 * is done by the consumer so it can support a per-group "Show all" expand.
 */
export function groupFoodsByKind(rows: readonly FoodRow[]): FoodKindGroup[] {
  const buckets = new Map<FoodTypeKind, FoodRow[]>()
  for (const f of rows) {
    const k = foodTypeKind(f.t)
    const list = buckets.get(k) ?? []
    list.push(f)
    buckets.set(k, list)
  }
  const out: FoodKindGroup[] = []
  for (const kind of FOOD_KIND_GROUP_ORDER) {
    const list = buckets.get(kind)
    if (!list || list.length === 0) continue
    const sorted = [...list].sort((a, b) => a.n.localeCompare(b.n))
    out.push({ kind, rows: sorted })
  }
  return out
}
