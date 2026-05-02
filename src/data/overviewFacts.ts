export type FactVariant = '' | 'clay' | 'gold' | 'plum' | 'sage' | 'slate'

export interface OverviewFact {
  stat: string
  title: string
  desc: string
  variant?: FactVariant
}

export const OVERVIEW_FACTS: OverviewFact[] = [
  {
    stat: '−22%',
    title: 'Lentils VAT reduction',
    desc: 'DIRECT PLUS: 18 months of legume-rich diet produced direct VAT reduction.',
  },
  {
    stat: '−4.9 cm²',
    title: 'ACV visceral fat drop',
    desc: 'Kondo RCT: 2 tbsp apple cider vinegar daily, waist −1.4 cm in 12 weeks.',
    variant: 'clay',
  },
  {
    stat: '+66%',
    title: 'Greater VAT loss with dairy',
    desc: 'Zemel 2005 RCT: Greek yoghurt / nono produced 66% more VAT loss vs control.',
    variant: 'sage',
  },
  {
    stat: '95%',
    title: 'Hunger reduction — spinach',
    desc: 'Thylakoid RCT: hunger down 95%, weight loss 5.5%. Eat raw.',
    variant: 'gold',
  },
  {
    stat: '−73%',
    title: 'Glucose rise from meal order',
    desc: 'Protein + fat → fibre → carbs cuts post-meal glucose 73%, insulin 48%.',
  },
  {
    stat: '+47%',
    title: 'Greater fat loss with diet break',
    desc: 'Matador: 2-week diet break at 2,100 kcal produces 47% more fat loss.',
    variant: 'clay',
  },
  {
    stat: '+37–45%',
    title: 'Cortisol rise from poor sleep',
    desc: '<6 hrs increases cortisol 37–45% and specifically promotes VAT.',
    variant: 'plum',
  },
  {
    stat: '+50 kcal/d',
    title: 'Cayenne thermogenesis',
    desc: 'Capsaicin TRPV1 activates UCP1 brown adipose. Compounding daily.',
    variant: 'gold',
  },
  {
    stat: '5.6 cm²',
    title: 'Green tea VAT reduction',
    desc: 'Meta: EGCG catechins. 3–4 cups/day, 1 hr from iron meals.',
    variant: 'sage',
  },
  {
    stat: '+250%',
    title: 'Dopamine — cold shower',
    desc: '2 min cold finish activates BAT. Dopamine elevated 2–3 hrs. Free cortisol tool.',
    variant: 'slate',
  },
  {
    stat: '+30–50%',
    title: 'Resistant starch (cook-then-cool)',
    desc: 'Retrogradation converts starches to RS3. Survives reheating.',
    variant: 'gold',
  },
  {
    stat: '6× orange',
    title: 'Baobab vitamin C density',
    desc: '15g baobab = 50% fibre by weight + 6× the vitamin C of an orange.',
    variant: 'clay',
  },
]
