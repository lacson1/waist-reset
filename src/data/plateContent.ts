export const PLATE_SWAPS: {
  slot: string
  western: string
  african: string
  why: string
}[] = [
  {
    slot: 'Leafy green',
    western: 'Spinach, kale',
    african: 'Ugu, ewedu, amaranth, cassava leaves',
    why: 'Higher protein per gram, similar polyphenols',
  },
  {
    slot: 'Lean protein',
    western: 'Chicken, tofu',
    african: 'Stockfish, tilapia, goat, guinea fowl',
    why: 'Same protein:calorie ratio',
  },
  {
    slot: 'Fermented dairy',
    western: 'Greek yoghurt, skyr',
    african: 'Nono, wara',
    why: 'Same casein + Lactobacillus pathway',
  },
  {
    slot: 'Slow carb',
    western: 'Lentils, oats, quinoa',
    african: 'Green plantain, teff, fonio, sorghum, ukwa',
    why: 'Resistant starch when cooked + cooled',
  },
  {
    slot: 'Healthy fat',
    western: 'EVOO, avocado',
    african: 'Red palm oil (1 tbsp), tiger nuts, African walnut',
    why: 'MUFA + polyphenols + tocotrienols',
  },
  {
    slot: 'Thermogenic',
    western: 'Cayenne, garlic',
    african: 'Scotch bonnet, uziza, ginger',
    why: 'Same TRPV1 capsaicinoid family',
  },
  {
    slot: 'Hydration anchor',
    western: 'Green tea',
    african: 'Zobo / hibiscus (no sugar)',
    why: 'Different polyphenols, similar role',
  },
  {
    slot: 'Probiotic / umami',
    western: 'Miso, kimchi',
    african: 'Dawadawa / iru',
    why: 'Bacillus subtilis fermentation',
  },
]

export const PLATE_SCENARIOS: { title: string; detail: string }[] = [
  {
    title: 'Low-energy day',
    detail: 'Soup-meal bowl: pepper soup + boiled eggs/fish + leafy greens.',
  },
  {
    title: 'Heavy training day',
    detail: 'Training plate: chicken thigh + green plantain + ugu + EVOO.',
  },
  {
    title: 'Eating out',
    detail: 'Suya / grilled tilapia / catfish + salad. No sugary drinks.',
  },
  {
    title: 'Breakfast (no IF)',
    detail: 'Nono or Greek yoghurt + chia + cinnamon + berries.',
  },
  {
    title: 'Quick lunch',
    detail: 'Tinned sardines + tomato + EVOO + lemon + leafy salad.',
  },
  {
    title: 'Family dinner',
    detail: 'Efo riro with stockfish + crayfish + side of steamed vegetables. Plantain optional.',
  },
]
