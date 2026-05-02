export const SUPP_YES: { n: string; dose: string; evidence: string; caution: string }[] = [
  {
    n: 'Creatine monohydrate',
    dose: '5 g/day, any time, with water',
    evidence: 'Strongest evidence base of any sports supplement. Lean mass preservation in deficit.',
    caution:
      'Avoid in known kidney disease or on creatinine-monitored medication. Hydrate well.',
  },
  {
    n: 'Vitamin D₃',
    dose: '1,000–2,000 IU/day after a 25(OH)D blood test',
    evidence: 'Most adults at temperate latitudes are deficient or insufficient. Multiple cardiometabolic associations.',
    caution:
      "Don't go above 2,000 IU long-term without testing. Hypercalcaemia risk in some genetic variants. Pair with vitamin K2 if on long-term high dose.",
  },
  {
    n: 'Magnesium glycinate',
    dose: '200–400 mg before bed',
    evidence: 'Inverse association with VAT and metabolic syndrome in cohorts. Helps sleep onset.',
    caution:
      'Skip or halve in stage 3+ CKD. Reduce dose if loose stools. Avoid with potassium-sparing diuretics without GP sign-off.',
  },
  {
    n: 'Omega-3 (EPA/DHA)',
    dose: '1–2 g/day combined EPA+DHA, only if you eat oily fish < 2x/week',
    evidence: 'Supports lipid markers and inflammation. Effect on body composition is small.',
    caution:
      'Stop 7 days before any planned surgery. Avoid alongside anticoagulants without GP clearance. Choose third-party tested brands.',
  },
  {
    n: 'Psyllium husk',
    dose: '5 g twice daily in 300 ml water',
    evidence: 'Reduces LDL ~7% in meta-analysis. Improves bowel regularity, satiety, post-meal glucose.',
    caution:
      'CRITICAL: take all medications either 1 hour BEFORE or 2–4 hours AFTER psyllium. It binds thyroid hormone, lithium, anticoagulants, some antidepressants.',
  },
]

export const SUPP_NO: { n: string; why: string }[] = [
  {
    n: 'Ashwagandha',
    why: 'Thyroid effects (raises T3/T4), pregnancy contraindicated, rare hepatotoxicity case reports. The cortisol-reduction evidence is mixed and effect size small.',
  },
  {
    n: 'Turmeric / curcumin extracts',
    why: 'May potentiate anticoagulants. Recent UK case reports of liver injury at high concentrated doses. Whole turmeric in cooking is fine; pills are not the same risk profile.',
  },
  {
    n: 'Berberine',
    why: 'Significant drug interactions. Not appropriate for combined diabetes medications without specialist supervision. Not a "natural Ozempic" — the pharmacology is different.',
  },
  {
    n: 'Green tea extract pills',
    why: 'Hepatotoxicity at high doses (case reports). Drinking the tea is fine; concentrated EGCG capsules are not.',
  },
  {
    n: 'Apple cider vinegar pills',
    why: 'Acetic acid concentration is unreliable. The mild glucose-blunting effect requires liquid pre-meal dosing. Skip the pills, use diluted liquid if tolerated.',
  },
  {
    n: 'BCAAs',
    why: 'Redundant if total protein is hit. EAAs, whey, or simply more food is more effective and cheaper.',
  },
  {
    n: 'CLA supplements',
    why: 'Older meta-analyses show small effects; newer evidence and adverse events (insulin resistance in some studies) make it not worth it.',
  },
  {
    n: 'Garcinia cambogia, raspberry ketones, "fat burners"',
    why: 'No reliable evidence. Some are stimulant cocktails with cardiovascular risk. Skip entirely.',
  },
]
