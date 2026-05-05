export type PlateSwapCategoryId = 'plate-core' | 'flavor-boost' | 'drinks-dairy'

export type PlateSwapAccent = 'teal' | 'sage' | 'clay'

export type PlateSwapRow = {
  category: PlateSwapCategoryId
  slot: string
  western: string
  african: string
  why: string
}

export const PLATE_SWAP_SECTION_META: Record<
  PlateSwapCategoryId,
  { title: string; lead: string; accent: PlateSwapAccent }
> = {
  'plate-core': {
    title: 'On the plate',
    lead: 'Same wedges, different pantries.',
    accent: 'teal',
  },
  'flavor-boost': {
    title: 'Heat, umami & gut',
    lead: 'Condiments & ferments.',
    accent: 'sage',
  },
  'drinks-dairy': {
    title: 'Drinks & cultured dairy',
    lead: 'Hydration & protein outside wedges.',
    accent: 'clay',
  },
}

const PLATE_SWAP_SECTION_ORDER: PlateSwapCategoryId[] = ['plate-core', 'flavor-boost', 'drinks-dairy']

export const PLATE_SWAPS: PlateSwapRow[] = [
  {
    category: 'plate-core',
    slot: 'Leafy green',
    western: 'Spinach, kale',
    african: 'Ugu, ewedu, amaranth, cassava leaves',
    why: 'Higher protein per gram, similar polyphenols',
  },
  {
    category: 'plate-core',
    slot: 'Lean protein',
    western: 'Chicken, tofu',
    african: 'Stockfish, tilapia, goat, guinea fowl',
    why: 'Same protein:calorie ratio',
  },
  {
    category: 'plate-core',
    slot: 'Slow carb',
    western: 'Lentils, oats, quinoa',
    african: 'Green plantain, teff, fonio, sorghum, ukwa',
    why: 'Resistant starch when cooked + cooled',
  },
  {
    category: 'plate-core',
    slot: 'Healthy fat',
    western: 'EVOO, avocado',
    african: 'Red palm oil (1 tbsp), tiger nuts, African walnut',
    why: 'MUFA + polyphenols + tocotrienols',
  },
  {
    category: 'flavor-boost',
    slot: 'Thermogenic',
    western: 'Cayenne, garlic',
    african: 'Scotch bonnet, uziza, ginger',
    why: 'Same TRPV1 capsaicinoid family',
  },
  {
    category: 'flavor-boost',
    slot: 'Probiotic / umami',
    western: 'Miso, kimchi',
    african: 'Dawadawa / iru',
    why: 'Bacillus subtilis fermentation',
  },
  {
    category: 'drinks-dairy',
    slot: 'Fermented dairy',
    western: 'Greek yoghurt, skyr',
    african: 'Nono, wara',
    why: 'Same casein + Lactobacillus pathway',
  },
  {
    category: 'drinks-dairy',
    slot: 'Hydration anchor',
    western: 'Green tea',
    african: 'Zobo / hibiscus (no sugar)',
    why: 'Different polyphenols, similar role',
  },
]

export const PLATE_SWAP_SECTIONS: {
  id: PlateSwapCategoryId
  title: string
  lead: string
  accent: PlateSwapAccent
  rows: PlateSwapRow[]
}[] = PLATE_SWAP_SECTION_ORDER.map((id) => ({
  id,
  ...PLATE_SWAP_SECTION_META[id],
  rows: PLATE_SWAPS.filter((r) => r.category === id),
}))

import {
  HEALTH_FOCUS_ORDER,
  type HealthFocus,
  type MealSlot,
  type MealTemplate,
} from '../domain/plateMeal'

/** Visual accent for focus picker, hint callout, and totals band (CSS `data-focus-theme`). */
export type HealthFocusTheme =
  | 'teal'
  | 'amber'
  | 'navy'
  | 'rose'
  | 'sage'
  | 'clay'
  | 'violet'

/** Meal builder: labels, hints, toolbar copy, totals lens, and theme. */
export const PLATE_BUILDER_FOCUS_META: Record<
  HealthFocus,
  {
    theme: HealthFocusTheme
    label: string
    hint: string
    suggest: string
    totalsEyebrow: string
  }
> = {
  weight: {
    theme: 'teal',
    label: 'Weight & calories',
    hint: 'Kcal and protein vs your phase targets.',
    suggest: 'Totals: kcal & protein vs phase.',
    totalsEyebrow: 'Weight — kcal & protein vs phase',
  },
  satiety: {
    theme: 'sage',
    label: 'Satiety & protein',
    hint: 'Protein anchor and meal size vs the day.',
    suggest: 'Totals: protein vs target and kcal share of the day.',
    totalsEyebrow: 'Satiety — protein vs target',
  },
  glycemic: {
    theme: 'amber',
    label: 'Glucose & carbs',
    hint: 'Carb share of this meal’s calories.',
    suggest: 'Totals: carb share of this meal.',
    totalsEyebrow: 'Glucose — carb % of meal',
  },
  lipid_heart: {
    theme: 'rose',
    label: 'Lipids & heart',
    hint: 'Fat and carb balance from macros (not medical advice).',
    suggest: 'Totals: fat % and carb % of this meal.',
    totalsEyebrow: 'Lipids — fat & carb % of meal',
  },
  blood_pressure: {
    theme: 'navy',
    label: 'Blood pressure',
    hint: 'Portion vs day; sodium not shown per line.',
    suggest: 'Totals: portion vs day (no sodium per item).',
    totalsEyebrow: 'Blood pressure — portion & patterns',
  },
  sodium: {
    theme: 'clay',
    label: 'Lower sodium',
    hint: 'Hidden salt in stocks, blends, and eating out.',
    suggest: 'Totals: meal size vs day — salt is not summed here.',
    totalsEyebrow: 'Sodium — meal size & hidden sources',
  },
  digestive: {
    theme: 'violet',
    label: 'Gut-friendly plate',
    hint: 'Veg/fibre wedges; no fibre grams in totals.',
    suggest: 'Totals: same macros — read lines with veg & fibre wedges in mind.',
    totalsEyebrow: 'Digestion — macros + wedge pattern',
  },
}

export const PLATE_BUILDER_FOCUS_OPTIONS: { id: HealthFocus; label: string; hint: string }[] =
  HEALTH_FOCUS_ORDER.map((id) => {
    const m = PLATE_BUILDER_FOCUS_META[id]
    return { id, label: m.label, hint: m.hint }
  })

export function healthFocusTheme(id: HealthFocus): HealthFocusTheme {
  return PLATE_BUILDER_FOCUS_META[id].theme
}

/** One row per wedge/layer — used by the plate builder guide (tap = select slot). */
export type PlateGuideRow = { slot: MealSlot; title: string; detail: string }

export const PLATE_BUILDER_GUIDE: Record<MealTemplate, PlateGuideRow[]> = {
  rest: [
    {
      slot: 'veg',
      title: '½ plate · Vegetables',
      detail: 'Greens, crucifers, tomato, peppers.',
    },
    {
      slot: 'protein',
      title: '¼ plate · Lean protein',
      detail: 'Fish, poultry, eggs, tofu, stockfish, yoghurt.',
    },
    {
      slot: 'fibre',
      title: '¼ plate · Fibre',
      detail: 'Lentils, beans — small on rest days.',
    },
  ],
  training: [
    {
      slot: 'veg',
      title: '½ plate · Vegetables',
      detail: 'Fill half the plate.',
    },
    {
      slot: 'protein',
      title: '¼ plate · Lean protein',
      detail: 'A bit more around training if needed.',
    },
    {
      slot: 'carbs',
      title: '¼ plate · Slow carbs',
      detail: 'Plantain, potato, grains, legumes. Cool after cooking for resistant starch.',
    },
  ],
  soup: [
    {
      slot: 'base',
      title: 'Base',
      detail: 'Pepper soup, ogbono, okra, efo, edikang ikong.',
    },
    {
      slot: 'protein',
      title: 'Protein anchor',
      detail: 'Stockfish, fish, chicken, eggs, goat.',
    },
    {
      slot: 'leafy',
      title: 'Leafy volume',
      detail: 'Ugu, ewedu, waterleaf, bitter leaf.',
    },
    {
      slot: 'aromatics',
      title: 'Aromatics',
      detail: 'Uziza, pepper, dawadawa, ginger, garlic.',
    },
    {
      slot: 'optional',
      title: 'Optional',
      detail: 'Small plantain on training days.',
    },
  ],
}

export const PLATE_BUILDER_GUIDE_FOOTER: Record<MealTemplate, string | null> = {
  rest: '+ Drizzle: 1 tbsp EVOO or ½ avocado (add a custom line if you want it counted).',
  training: '+ Drizzle: 1 tbsp EVOO (add a custom line if you want it counted).',
  soup: null,
}

/** One wedge line for “Load on plate” scenario presets (illustrative macros). */
export type PlateScenarioPresetLine = {
  slot: MealSlot
  label: string
  kcal: number
  p: number
  f: number
  c: number
  portion?: number
}

export type PlateScenarioPreset = {
  template: MealTemplate
  lines: PlateScenarioPresetLine[]
}

export type PlateScenarioCard = {
  title: string
  detail: string
  /** Fills the builder: template + one custom line per wedge layer. */
  platePreset?: PlateScenarioPreset
}

export const PLATE_SCENARIOS: PlateScenarioCard[] = [
  {
    title: 'Low-energy day',
    detail: 'Soup-meal bowl: pepper soup + boiled eggs/fish + leafy greens.',
    platePreset: {
      template: 'soup',
      lines: [
        { slot: 'base', label: 'Pepper soup / light broth base', kcal: 95, p: 6, f: 4, c: 9 },
        { slot: 'protein', label: 'Boiled eggs & fish', kcal: 210, p: 34, f: 11, c: 2 },
        { slot: 'leafy', label: 'Leafy greens volume', kcal: 48, p: 4, f: 1, c: 8 },
        { slot: 'aromatics', label: 'Ginger, pepper, uziza', kcal: 18, p: 0.5, f: 0, c: 3 },
        { slot: 'optional', label: 'Optional: small plantain', kcal: 70, p: 1, f: 0, c: 17 },
      ],
    },
  },
  {
    title: 'Heavy training day',
    detail: 'Training plate: chicken thigh + green plantain + ugu + EVOO.',
    platePreset: {
      template: 'training',
      lines: [
        { slot: 'veg', label: 'Ugu / leafy veg (½ plate wedge)', kcal: 72, p: 6, f: 2, c: 10 },
        { slot: 'protein', label: 'Chicken thigh', kcal: 235, p: 31, f: 14, c: 0 },
        { slot: 'carbs', label: 'Green plantain (cooled for RS)', kcal: 165, p: 2, f: 0, c: 40 },
        { slot: 'veg', label: '1 tbsp EVOO drizzle (counted on veg wedge)', kcal: 120, p: 0, f: 14, c: 0 },
      ],
    },
  },
  {
    title: 'Eating out',
    detail: 'Suya / grilled tilapia / catfish + salad. No sugary drinks.',
    platePreset: {
      template: 'training',
      lines: [
        { slot: 'veg', label: 'Salad greens + tomato', kcal: 85, p: 5, f: 5, c: 10 },
        { slot: 'protein', label: 'Grilled tilapia / catfish / suya-style meat', kcal: 225, p: 34, f: 10, c: 3 },
        { slot: 'carbs', label: 'Side: small plantain or rice', kcal: 135, p: 3, f: 1, c: 27 },
      ],
    },
  },
  {
    title: 'Breakfast (no IF)',
    detail: 'Nono or Greek yoghurt + chia + cinnamon + berries.',
    platePreset: {
      template: 'rest',
      lines: [
        { slot: 'protein', label: 'Nono / Greek yoghurt + cinnamon', kcal: 175, p: 14, f: 8, c: 16 },
        { slot: 'veg', label: 'Berries + lemon zest', kcal: 65, p: 1, f: 0.5, c: 15 },
        { slot: 'fibre', label: 'Chia soak / flax', kcal: 85, p: 3, f: 5, c: 6 },
      ],
    },
  },
  {
    title: 'Quick lunch',
    detail: 'Tinned sardines + tomato + EVOO + lemon + leafy salad.',
    platePreset: {
      template: 'rest',
      lines: [
        { slot: 'protein', label: 'Tinned sardines', kcal: 165, p: 22, f: 10, c: 0 },
        { slot: 'veg', label: 'Tomato + lemon + leafy salad', kcal: 58, p: 3, f: 3, c: 9 },
        { slot: 'fibre', label: 'EVOO on greens', kcal: 90, p: 0, f: 10, c: 0 },
      ],
    },
  },
  {
    title: 'Family dinner',
    detail: 'Efo riro with stockfish + crayfish + side of steamed vegetables. Plantain optional.',
    platePreset: {
      template: 'soup',
      lines: [
        { slot: 'base', label: 'Efo riro / stew base', kcal: 210, p: 9, f: 14, c: 14 },
        { slot: 'protein', label: 'Stockfish + crayfish', kcal: 185, p: 33, f: 6, c: 2 },
        { slot: 'leafy', label: 'Steamed greens on the side', kcal: 52, p: 4, f: 1, c: 8 },
        { slot: 'aromatics', label: 'Onion, pepper blend', kcal: 28, p: 1, f: 0, c: 6 },
        { slot: 'optional', label: 'Optional: small plantain', kcal: 85, p: 1, f: 0, c: 20 },
      ],
    },
  },
]
