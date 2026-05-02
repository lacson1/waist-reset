export interface TimelineEntry {
  time: string
  state: 'fed' | 'fasted'
  kcal: number
  label: string
  detail: string
  mech: string
}

export const TIMELINE_GENERAL: TimelineEntry[] = [
  {
    time: '06:30',
    state: 'fasted',
    kcal: 28,
    label: 'Pre-IF Priming',
    detail: 'Psyllium 5g + water | Green tea #1 + moringa 5g',
    mech: 'Psyllium gel + moringa AMPK fasted',
  },
  {
    time: '08:00',
    state: 'fasted',
    kcal: 6,
    label: 'Thermogenic Stack',
    detail: 'Green tea #2 | ACV 2 tbsp diluted',
    mech: 'EGCG + fasted = peak oxidation',
  },
  {
    time: '10:00',
    state: 'fed',
    kcal: 550,
    label: 'Break Fast (~550 kcal)',
    detail: 'Sardines/stockfish on spinach/ugu + avocado + EVOO + garlic + cayenne',
    mech: '28g protein. Omega-3 + MUFA stack',
  },
  {
    time: '13:00',
    state: 'fed',
    kcal: 0,
    label: 'EGCG Top-up',
    detail: 'Green tea #3',
    mech: '1 hr from iron meals',
  },
  {
    time: '14:00',
    state: 'fed',
    kcal: 700,
    label: 'Main Meal (~700 kcal)',
    detail: 'Chicken/salmon + broccoli + cabbage | lentils/plantain + shiitake + EVOO',
    mech: 'Cruciferous double. RS butyrate',
  },
  {
    time: '18:30',
    state: 'fed',
    kcal: 5,
    label: 'Pre-dinner Fibre',
    detail: 'Psyllium 5g',
    mech: 'Reduces absorption 7%',
  },
  {
    time: '19:00',
    state: 'fed',
    kcal: 500,
    label: 'Close Window (~500 kcal)',
    detail: '2 eggs + yoghurt + chia + cinnamon | Cucumber + konjac + MCT',
    mech: 'Casein overnight. Volume foods',
  },
  {
    time: '19:30',
    state: 'fasted',
    kcal: 0,
    label: 'Fast Begins',
    detail: 'Green tea #4 (decaf)',
    mech: 'Eating window closes. Sleep + recovery focus',
  },
  {
    time: '22:00',
    state: 'fasted',
    kcal: 0,
    label: 'Sleep Prep',
    detail: 'Magnesium glycinate 400mg. Target 7hr+ sleep.',
    mech: 'Cortisol reduction + sleep quality',
  },
]

export const TIMELINE_AFRICAN: TimelineEntry[] = [
  {
    time: '06:00',
    state: 'fasted',
    kcal: 48,
    label: 'African Morning Ritual',
    detail: 'Psyllium + baobab + water | Moringa warm water',
    mech: 'Baobab adds 6.5g fibre. Thicker gel',
  },
  {
    time: '07:30',
    state: 'fasted',
    kcal: 13,
    label: 'Zobo Thermogenic Stack',
    detail: 'Zobo 500ml ginger+clove | ACV dissolved in zobo',
    mech: 'Triple AMPK: anthocyanins + gingerols + acetic acid',
  },
  {
    time: '10:00',
    state: 'fed',
    kcal: 550,
    label: 'Efo Riro (~550 kcal)',
    detail: 'Stockfish + sardines on ugu | Palm oil + EVOO + crayfish + uziza',
    mech: '45g protein. TRPV1 stack',
  },
  {
    time: '12:30',
    state: 'fed',
    kcal: 17,
    label: 'Mid-Window',
    detail: 'Zobo or green tea | Bitter kola ×1',
    mech: 'Alternate weekly. Bile stimulation',
  },
  {
    time: '14:00',
    state: 'fed',
    kcal: 700,
    label: 'Ogbono + Bitter Leaf (~700 kcal)',
    detail: 'Ogbono soup + bitter leaf + protein | Broccoli + dawadawa + EVOO + plantain/konjac',
    mech: 'PPARγ + α-glucosidase. Most dense meal',
  },
  {
    time: '18:00',
    state: 'fed',
    kcal: 25,
    label: 'Pre-dinner Fibre',
    detail: 'Psyllium + baobab',
    mech: 'Second dose',
  },
  {
    time: '18:30',
    state: 'fed',
    kcal: 450,
    label: 'Edikang Ikong (~450 kcal)',
    detail: 'Nono + chia + cinnamon | Ugu + waterleaf + stockfish + crayfish + eggs + tiger nuts',
    mech: 'Two ultra-low-cal leaves. Nono = yoghurt',
  },
  {
    time: '19:00',
    state: 'fasted',
    kcal: 8,
    label: 'Fast Begins',
    detail: 'Zobo or green tea',
    mech: 'Caffeine-free option. 16hr fast',
  },
]
