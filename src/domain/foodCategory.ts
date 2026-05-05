import type { FoodRow } from './foods'
import type { MealSlot, MealTemplate } from './plateMeal'

/**
 * Fine-grained food category used for slot-affinity matching.
 *
 * The existing `t` (type) tag — Protein / Fibre / Volume / etc. — is a
 * library-style label that is good for browsing but is too coarse to drive
 * the plate builder. "Fibre" lumps broccoli with lentils, oats, and
 * blueberries, which means a search for "catfish" shows up cheerfully under
 * the Vegetables wedge.
 *
 * `FoodCat` is the *primary nutritional role* used to decide which plate
 * wedge a food belongs to. Every food has exactly one cat.
 */
export type FoodCat =
  | 'leafy'
  | 'veg'
  | 'fungus'
  | 'fermented-veg'
  | 'kelp'
  | 'fruit'
  | 'legume'
  | 'grain'
  | 'tuber'
  | 'seed'
  | 'nut'
  | 'meat'
  | 'fish'
  | 'shellfish'
  | 'egg'
  | 'dairy'
  | 'plant-protein'
  | 'fat'
  | 'spice'
  | 'beverage'
  | 'powder'
  | 'broth'
  | 'fibre-supplement'
  | 'chocolate'

const ALL_CATS: readonly FoodCat[] = [
  'leafy',
  'veg',
  'fungus',
  'fermented-veg',
  'kelp',
  'fruit',
  'legume',
  'grain',
  'tuber',
  'seed',
  'nut',
  'meat',
  'fish',
  'shellfish',
  'egg',
  'dairy',
  'plant-protein',
  'fat',
  'spice',
  'beverage',
  'powder',
  'broth',
  'fibre-supplement',
  'chocolate',
] as const

/** Type-guard: does a string look like a known FoodCat? */
export function isFoodCat(value: unknown): value is FoodCat {
  return typeof value === 'string' && (ALL_CATS as readonly string[]).includes(value)
}

/**
 * Best-guess fallback when a row in foods.json has no `cat` field yet.
 *
 * Resolution rules in order:
 *   1. Match well-known names (catfish → fish, ogbono → fibre-supplement, …).
 *   2. Fall back to the row's `t` tag using a coarse mapping.
 *   3. Default to 'veg' as the safest neutral bucket.
 *
 * The lookup is intentionally generous on synonyms (case-insensitive, ignoring
 * accents). This keeps the UI sensible even if foods.json drifts ahead of the
 * schema.
 */
export function inferFoodCat(food: FoodRow): FoodCat {
  if (isFoodCat(food.cat)) return food.cat
  const name = normalizeName(food.n)
  const named = inferFromName(name)
  if (named) return named
  return inferFromType(food.t)
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
}

/**
 * Name-based fallback rules. Each pattern uses lowercase, accent-stripped
 * names (see `normalizeName`) and matches a stem rather than a strict word
 * because plurals and variants are common ("Sardines", "Walnuts", "Almonds").
 * Order is meaningful — earlier rules win, so we list specific stems before
 * broad ones (e.g. "stockfish" before generic "fish" stems).
 */
const NAME_RULES: { match: RegExp; cat: FoodCat }[] = [
  { match: /(catfish|stockfish|tilapia|salmon|sardine|mackerel|anchov|tuna\b|\bcod\b|herring)/, cat: 'fish' },
  { match: /(crayfish|prawn|shrimp|mussel|oyster|\bclam\b|periwinkle|snail)/, cat: 'shellfish' },
  { match: /(chicken|turkey|\bbeef\b|\bgoat\b|guinea fowl|\blamb\b|\bpork\b|venison|\bduck\b)/, cat: 'meat' },
  { match: /^eggs?$|^\d+\s+eggs?$/, cat: 'egg' },
  { match: /(yoghurt|yogurt|kefir|skyr|quark|cottage cheese|\bnono\b|\bwara\b)/, cat: 'dairy' },
  { match: /(tempeh|whey isolate|soy protein)/, cat: 'plant-protein' },
  { match: /(lentil|black bean|chickpea|black-eyed pea|edamame|bambara|yam bean|breadfruit|ukwa)/, cat: 'legume' },
  { match: /(\boat|quinoa|barley|fonio|millet|sorghum|teff|\bogi|akamu)/, cat: 'grain' },
  { match: /(plantain|cocoyam|sweet potato$|sweet potato roast|\byam$|cassava root)/, cat: 'tuber' },
  { match: /(chia|flax|hemp|pumpkin seed|fluted pumpkin|egusi|sesame)/, cat: 'seed' },
  { match: /(walnut|almond|brazil nut|pistachio|macadamia|tiger nut|kulikuli)/, cat: 'nut' },
  { match: /(spinach|kale|watercress|endive|chicory|ewedu|\bugu\b|waterleaf|sorrel|cassava leaf|sweet potato leaf|moringa leaves|amaranth|bitter leaf)/, cat: 'leafy' },
  { match: /(broccoli|cabbage|brussels|cauliflower|asparagus|bell pepper|zucchini|beetroot|celery|garden egg|carrot|tomato|cucumber|okra)/, cat: 'veg' },
  { match: /(shiitake|lions mane|portobello|button mushroom)/, cat: 'fungus' },
  { match: /(sauerkraut|kimchi)/, cat: 'fermented-veg' },
  { match: /(seaweed|kelp|\bnori\b|wakame)/, cat: 'kelp' },
  { match: /(blueberr|strawberr|raspberr|apple|pomegranate|grapefruit|orange|banana|\bberry)/, cat: 'fruit' },
  { match: /(evoo|olive oil|avocado|\bolives\b|\bmct\b|red palm oil|shea butter|tahini|coconut oil)/, cat: 'fat' },
  { match: /(cinnamon|turmeric|garlic|ginger|cayenne|black pepper|mustard|clove|uziza|\buda\b|ehuru|alligator pepper|scotch bonnet|garcinia|suya|dawadawa|nutmeg)/, cat: 'spice' },
  { match: /(green tea|black coffee|\bcoffee\b|\btea$|zobo|hibiscus|\bkunu\b|\bacv\b|apple cider vinegar)/, cat: 'beverage' },
  { match: /(^moringa$|moringa powder|baobab|cocoa)/, cat: 'powder' },
  { match: /(bone broth|^broth$|^stock$)/, cat: 'broth' },
  { match: /(psyllium|konjac|ogbono)/, cat: 'fibre-supplement' },
  { match: /(dark chocolate|cacao bar)/, cat: 'chocolate' },
]

function inferFromName(name: string): FoodCat | null {
  for (const rule of NAME_RULES) {
    if (rule.match.test(name)) return rule.cat
  }
  return null
}

function inferFromType(t: string | undefined): FoodCat {
  if (!t) return 'veg'
  const k = t.toLowerCase()
  if (k.includes('protein')) return 'meat'
  if (k.includes('leafy')) return 'leafy'
  if (k.includes('volume')) return 'veg'
  if (k.includes('vat')) return 'beverage'
  if (k.includes('thermo')) return 'spice'
  if (k.includes('fat')) return 'fat'
  if (k.includes('ferment') || k.includes('gut')) return 'fermented-veg'
  if (k.includes('fibre') || k.includes('fiber') || k.includes('rs')) return 'veg'
  return 'veg'
}

/** Short, human-friendly label for a FoodCat (used in tooltips and lists). */
export function foodCatLabel(cat: FoodCat): string {
  switch (cat) {
    case 'leafy':
      return 'Leafy green'
    case 'veg':
      return 'Vegetable'
    case 'fungus':
      return 'Mushroom'
    case 'fermented-veg':
      return 'Fermented veg'
    case 'kelp':
      return 'Sea vegetable'
    case 'fruit':
      return 'Fruit'
    case 'legume':
      return 'Legume'
    case 'grain':
      return 'Grain'
    case 'tuber':
      return 'Tuber / starchy root'
    case 'seed':
      return 'Seed'
    case 'nut':
      return 'Nut'
    case 'meat':
      return 'Meat / poultry'
    case 'fish':
      return 'Fish'
    case 'shellfish':
      return 'Shellfish'
    case 'egg':
      return 'Egg'
    case 'dairy':
      return 'Dairy'
    case 'plant-protein':
      return 'Plant protein'
    case 'fat':
      return 'Culinary fat'
    case 'spice':
      return 'Spice / aromatic'
    case 'beverage':
      return 'Beverage'
    case 'powder':
      return 'Adjunct powder'
    case 'broth':
      return 'Broth'
    case 'fibre-supplement':
      return 'Fibre supplement'
    case 'chocolate':
      return 'Dark chocolate'
  }
}

/**
 * Cats that belong on the active wedge for a given (template, slot).
 *
 * Returns `null` when the slot is intentionally flexible (e.g. soup
 * "optional"). `null` is treated by callers as "accept anything"; an empty
 * array would mean "accept nothing", which is never what we want here.
 *
 * Keep these lists deliberately tight — the UX promise is: "if a food shows up
 * under Matches for the Vegetables wedge, it actually belongs there."
 * Borderline items live under "Other foods".
 */
const REST_VEG_CATS: readonly FoodCat[] = ['leafy', 'veg', 'fungus', 'fermented-veg', 'kelp']
const TRAIN_VEG_CATS: readonly FoodCat[] = REST_VEG_CATS
const REST_PROTEIN_CATS: readonly FoodCat[] = [
  'meat',
  'fish',
  'shellfish',
  'egg',
  'dairy',
  'plant-protein',
]
const REST_FIBRE_CATS: readonly FoodCat[] = ['legume', 'fruit', 'seed', 'nut', 'fibre-supplement']
const TRAIN_CARBS_CATS: readonly FoodCat[] = ['grain', 'tuber', 'legume']
const SOUP_BASE_CATS: readonly FoodCat[] = [
  'fibre-supplement',
  'broth',
  'fungus',
  'kelp',
  'fermented-veg',
  'veg',
]
const SOUP_AROMATIC_CATS: readonly FoodCat[] = ['spice', 'powder']
const SOUP_LEAFY_CATS: readonly FoodCat[] = ['leafy']

export function slotAcceptedCats(
  template: MealTemplate,
  slot: MealSlot,
): readonly FoodCat[] | null {
  if (template === 'rest') {
    if (slot === 'veg') return REST_VEG_CATS
    if (slot === 'protein') return REST_PROTEIN_CATS
    if (slot === 'fibre') return REST_FIBRE_CATS
  }
  if (template === 'training') {
    if (slot === 'veg') return TRAIN_VEG_CATS
    if (slot === 'protein') return REST_PROTEIN_CATS
    if (slot === 'carbs') return TRAIN_CARBS_CATS
  }
  if (template === 'soup') {
    if (slot === 'base') return SOUP_BASE_CATS
    if (slot === 'protein') return REST_PROTEIN_CATS
    if (slot === 'leafy') return SOUP_LEAFY_CATS
    if (slot === 'aromatics') return SOUP_AROMATIC_CATS
    if (slot === 'optional') return null
  }
  return null
}

/** Does `food` naturally belong in the given wedge? */
export function foodMatchesSlot(
  food: FoodRow,
  template: MealTemplate,
  slot: MealSlot,
): boolean {
  const accepted = slotAcceptedCats(template, slot)
  if (accepted === null) return true
  return accepted.includes(inferFoodCat(food))
}
