export interface RuleItem {
  name: string
  sev: string
  desc: string
  ev?: string
}

export const RULES_GENERAL: RuleItem[] = [
  {
    name: 'Protein distribution',
    sev: 'CRITICAL',
    desc: '2.5–3g leucine/meal. 3 × 45g = 140g. Even spread = +25% MPS.',
  },
  {
    name: 'Meal order',
    sev: 'CRITICAL',
    desc: 'Protein+fat then fibre+veg then carbs. Reduces glucose 73%, insulin 48%.',
  },
  {
    name: 'Green tea spacing',
    sev: 'CRITICAL',
    desc: '1hr+ from iron meals. EGCG chelates non-heme iron 64%.',
  },
  {
    name: 'EVOO thermal limit',
    sev: 'HIGH',
    desc: 'Post-cooking or max 180°C. Polyphenols drop 40% above smoke point.',
  },
  {
    name: 'Carb cycling',
    sev: 'HIGH',
    desc: 'Wed+Sat: 80g lentils/plantain (~50g net). Other days: 20–30g.',
  },
  {
    name: 'ACV protocol',
    sev: 'HIGH',
    desc: '2 tbsp in 250ml+ water. Straw. 15 min before Meal 1.',
  },
  {
    name: 'Recomp cycling',
    sev: 'HIGH',
    desc: 'Average 1,750. Option: 1,600 rest / 1,900 training days.',
  },
  { name: 'Fibre ramp', sev: 'MEDIUM', desc: '+5g/week to 32g target.' },
]

export const RULES_AFRICAN: RuleItem[] = [
  {
    name: 'Ogbono as VAT centrepiece',
    sev: 'HIGH',
    ev: 'B+',
    desc: 'PPARγ evidence from 5 RCTs. Mucilage slows gastric emptying. 3–4×/week.',
  },
  {
    name: "Bitter leaf: wash, don't boil",
    sev: 'CRITICAL',
    ev: 'C+',
    desc: 'Squeeze-wash preserves vernodalin. Bitterness stimulates bile.',
  },
  {
    name: 'Zobo alternates with green tea',
    sev: 'CRITICAL',
    ev: 'B+',
    desc: 'Different pathways: anthocyanins vs EGCG. Never add sugar.',
  },
  {
    name: 'Green plantain: green + cooled',
    sev: 'CRITICAL',
    ev: 'B',
    desc: 'RS only unripe (GI 40 vs 70+). Cool 30 min+ after cooking.',
  },
  {
    name: 'Dawadawa replaces stock cubes',
    sev: 'HIGH',
    ev: 'C+',
    desc: 'Bacillus subtilis probiotic. Umami reduces salt need.',
  },
  {
    name: 'Nono = Greek yoghurt swap',
    sev: 'HIGH',
    ev: 'B',
    desc: 'Same CLA + casein + Lactobacillus. Unsweetened, full-fat.',
  },
  {
    name: 'Triple TRPV1 stack',
    sev: 'HIGH',
    ev: 'C+/A',
    desc: 'Uziza + scotch bonnet + cayenne in every meal.',
  },
  {
    name: 'Baobab stacks with psyllium',
    sev: 'HIGH',
    ev: 'B',
    desc: 'Combined gel more viscous. 50% fibre by weight.',
  },
  {
    name: 'Weigh egusi + tiger nuts',
    sev: 'CRITICAL',
    ev: 'C+',
    desc: '155 and 120 kcal per portion. Easy to overshoot 1,750.',
  },
  {
    name: 'Cook-then-cool all starches',
    sev: 'CRITICAL',
    ev: 'A',
    desc: 'Retrogradation converts to RS3. +30–50%. Survives reheating.',
  },
  {
    name: 'Pepper soup circuit breaker',
    sev: 'HIGH',
    ev: 'A/C+',
    desc: 'Lean protein + triple spice. ~350 kcal comfort meal.',
  },
  {
    name: 'Ogi: carb days ONLY',
    sev: 'CRITICAL',
    ev: 'C+',
    desc: 'GI 70–80. Thin consistency. Always pair with protein.',
  },
]

export interface BiomarkerRow {
  name: string
  target: string
  freq: string
  link: string
  priority?: boolean
}

export const BIOMARKERS: BiomarkerRow[] = [
  {
    name: 'TG:HDL ratio',
    target: '< 1.0',
    freq: 'Every 8 weeks',
    link: 'Most sensitive IR proxy for VAT storage',
    priority: true,
  },
  {
    name: 'Fasting insulin',
    target: '< 5 μIU/mL',
    freq: 'Every 8 weeks',
    link: 'Primary hormonal VAT driver via LPL',
  },
  {
    name: 'hsCRP',
    target: '< 0.5 mg/L',
    freq: 'Every 12 weeks',
    link: 'VAT = largest IL-6 source. Falling = shrinking',
  },
  {
    name: 'Waist circumference',
    target: '< 94 cm',
    freq: 'Weekly',
    link: 'Best anthropometric VAT proxy. Iliac crest, AM, fasted',
  },
  {
    name: 'HOMA-IR',
    target: '< 1.0',
    freq: 'Every 8 weeks',
    link: 'Breaking IR > VAT > IR cycle is the core goal',
  },
  {
    name: 'Adiponectin',
    target: '> 10 μg/mL',
    freq: 'Every 12 weeks',
    link: 'Rising = VAT mobilising',
  },
  {
    name: 'Fasting glucose',
    target: '< 4.7 mmol/L',
    freq: 'Every 8 weeks',
    link: 'Longevity target. VAT drives hepatic glucose',
  },
]

export interface SynergyRow {
  t: string
  d: string
}

export const SYNERGIES: SynergyRow[] = [
  { t: 'Sardines + Spinach', d: 'EPA/DHA adiponectin + thylakoid GLP-1 = dual satiety + VAT sensitisation' },
  { t: 'Broccoli + Garlic', d: 'Nrf2 + AMPK synergistic anti-inflammatory. Both need chop+rest.' },
  { t: 'Lentils + ACV', d: 'Resistant-starch butyrate + acetic acid AMPK = compounded hepatic lipogenesis reduction' },
  { t: 'Green tea + Cayenne', d: 'EGCG + capsaicin = +80 kcal/d combined thermogenesis' },
  { t: 'Ogbono + Bitter leaf', d: 'PPARγ + α-glucosidase inhibition. Double mucilage satiety.' },
  { t: 'Zobo + Ginger + Baobab', d: 'Triple AMPK + 6.5g fibre in one drink' },
  { t: 'Stockfish + Ugu + Crayfish', d: 'Triple protein: 5g+ leucine combined' },
  { t: 'Nono + Chia + Cinnamon', d: 'CLA + casein + gel fibre + AMPK overnight' },
  { t: 'Skyr + Blueberries + Walnuts', d: 'Highest-casein dairy + anthocyanin + ALA. Built-for-purpose breakfast.' },
  { t: 'Kimchi + Eggs', d: 'L. plantarum + capsaicin + complete protein. The "no time" meal.' },
  { t: 'Teff + Lentils + Goat', d: 'Calcium-rich grain + RS legume + lean red meat. Carb-day powerhouse.' },
  { t: 'Anchovies + Kale + EVOO + Lemon', d: 'Omega-3 + sulforaphane + MUFA + vitamin C. PREDIMED in one bowl.' },
  { t: 'Mussels + Tomato + Garlic', d: 'B12 + lycopene + allicin. Sicilian-style pepper soup.' },
  { t: 'Black coffee + Cinnamon', d: 'Caffeine + cinnamaldehyde for AM glucose-blunting (no sugar).' },
  { t: 'Pistachios + Pomegranate', d: 'MUFA + carotenoids + punicalagin. Card-day dessert option.' },
]
