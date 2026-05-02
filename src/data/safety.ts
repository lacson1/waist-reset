export const CONTRAINDICATIONS: { title: string; detail: string }[] = [
  {
    title: 'Type 1 diabetes, or insulin / sulfonylurea use',
    detail:
      'Risk of hypoglycaemia from calorie deficit, carb cycling, or fasting windows. Requires medical supervision and likely dose adjustment.',
  },
  {
    title: 'Pregnancy, breastfeeding, or trying to conceive',
    detail:
      'Calorie restriction, fasting, and several supplements (ashwagandha, high-dose curcumin, berberine) are contraindicated.',
  },
  {
    title: 'Chronic kidney disease (stage 3+) or dialysis',
    detail: 'High protein targets, magnesium, and some herbs need formal renal review. Do not self-prescribe.',
  },
  {
    title: 'History of an eating disorder',
    detail:
      'Calorie tracking, biomarker focus, and fasting can reactivate restrictive behaviours. Work with a clinician familiar with EDs.',
  },
  {
    title: 'Active gallstones or recent gallbladder symptoms',
    detail: 'High-fat meals, rapid weight loss, and turmeric can trigger biliary colic.',
  },
  {
    title: 'Anticoagulant or antiplatelet medication',
    detail: 'Turmeric, omega-3 at higher doses, and garlic supplements can potentiate bleeding risk.',
  },
  {
    title: 'Hyperthyroidism or thyroid medication',
    detail:
      'Ashwagandha and seaweed/iodine intake can shift thyroid markers. Levothyroxine absorption is reduced by psyllium and high-fibre meals.',
  },
  {
    title: 'Significant reflux, peptic ulcer, or gastritis',
    detail: 'ACV and high-volume meals can worsen symptoms. Skip ACV; reduce raw cruciferous load.',
  },
  {
    title: 'Immunosuppressant medication or transplant history',
    detail: "Grapefruit, St John's wort, and some adaptogens have major interactions. Requires specialist review.",
  },
  {
    title: 'Severe hypoglycaemia history, frequent fainting, or autonomic dysfunction',
    detail: 'Fasting windows are not safe without monitoring. Eat to a regular schedule.',
  },
]

export const INTERACTIONS: {
  sev: string
  drug: string
  with: string
  action: string
}[] = [
  {
    sev: 'critical',
    drug: 'Levothyroxine (thyroid)',
    with: 'Psyllium, high-calcium foods, coffee',
    action:
      'Take levothyroxine 60 minutes before any food, fibre, or coffee. Do not take psyllium within 4 hours of a thyroid dose.',
  },
  {
    sev: 'critical',
    drug: 'Warfarin / DOACs',
    with: 'Turmeric extract, fish-oil capsules, garlic supplements, high vitamin K leaves',
    action:
      'Keep vitamin K intake (kale, spinach, ugu, cassava leaves) consistent week to week. Do not start turmeric or garlic supplements without GP sign-off.',
  },
  {
    sev: 'critical',
    drug: 'Insulin / sulfonylureas',
    with: 'Calorie deficit, carb cycling, intermittent fasting',
    action:
      'Risk of hypoglycaemia. Doses often need reducing. Requires diabetes-team supervision and home glucose monitoring.',
  },
  {
    sev: 'critical',
    drug: 'Statins, CCBs, immunosuppressants',
    with: 'Grapefruit',
    action: 'Avoid grapefruit entirely. CYP3A4 inhibition is dose-independent and lasts 24+ hours.',
  },
  {
    sev: 'high',
    drug: 'Lithium',
    with: 'Psyllium, sodium changes, dehydration',
    action: 'Psyllium can reduce absorption. Large sodium swings change serum lithium. Hydrate consistently.',
  },
  {
    sev: 'high',
    drug: 'SSRIs / SNRIs',
    with: "Psyllium, St John's wort",
    action: "Space psyllium 4 hours from dose. Do not combine with St John's wort.",
  },
  {
    sev: 'high',
    drug: 'Iron supplements',
    with: 'Green tea, coffee, calcium-rich meals',
    action:
      'Take iron 1 hour before or 2 hours after tea, coffee, or dairy. Vitamin C (lemon, bell pepper) increases absorption.',
  },
  {
    sev: 'high',
    drug: 'PPIs / antacids',
    with: 'High-protein meals, magnesium',
    action:
      'Reduced gastric acid impairs B12, magnesium, calcium, and iron absorption. Test ferritin and B12 if on long-term PPIs.',
  },
  {
    sev: 'medium',
    drug: 'Diuretics',
    with: 'Potassium-rich foods, magnesium',
    action: 'Potassium-sparing diuretics + high-magnesium intake = hyperkalaemia risk. Discuss with GP.',
  },
  {
    sev: 'medium',
    drug: 'NSAIDs',
    with: 'High-fibre / high-volume meals',
    action: 'GI irritation may increase. Take with food and adequate water.',
  },
]

export const SAFETY_SUPPLEMENTS: { sev: string; name: string; desc: string }[] = [
  {
    sev: 'critical',
    name: 'Grapefruit',
    desc: 'Check ALL medications. CYP3A4 interactions with statins, CCBs, immunosuppressants, some antidepressants.',
  },
  {
    sev: 'high',
    name: 'ACV',
    desc: 'Always dilute 2 tbsp in 250ml+ water. Drink through a straw. Rinse mouth after. Skip if active reflux or peptic ulcer.',
  },
  {
    sev: 'high',
    name: 'Green tea',
    desc: '1hr+ away from iron-rich meals. Chelates non-heme iron up to 64% — a real concern for women with low ferritin.',
  },
  {
    sev: 'high',
    name: 'Psyllium',
    desc: 'Take medications 1hr BEFORE or 2–4hr AFTER psyllium. Gel can trap thyroid hormone, lithium, anticoagulants, some antidepressants.',
  },
  {
    sev: 'high',
    name: 'Turmeric / curcumin extracts',
    desc: 'May potentiate anticoagulants. Recent UK case reports of liver injury at high doses. Avoid with active gallstones.',
  },
  {
    sev: 'high',
    name: 'Ashwagandha',
    desc: 'May raise thyroid hormones. Contraindicated in hyperthyroidism, pregnancy, breastfeeding. Rare hepatotoxicity case reports.',
  },
  {
    sev: 'high',
    name: 'Ceylon vs Cassia cinnamon',
    desc: 'Cassia contains coumarin (hepatotoxic at higher intake). Use Ceylon only for daily use.',
  },
  {
    sev: 'high',
    name: 'Magnesium',
    desc: '200–400mg glycinate is generally well tolerated. Skip or halve if stage-3+ CKD or on potassium-sparing diuretics.',
  },
  {
    sev: 'high',
    name: 'Vitamin D₃',
    desc: 'Test 25(OH)D before going above 1,000–2,000 IU/day. Hypercalcaemia risk in some genetic variants.',
  },
  {
    sev: 'medium',
    name: 'Omega-3 supplements',
    desc: 'Stop 7 days before any planned surgery. Avoid alongside anticoagulants without clinician sign-off.',
  },
  {
    sev: 'medium',
    name: 'MCT oil',
    desc: 'Start 1 tsp, build to 1 tbsp over 2 weeks. Skip if a history of GI distress or gallbladder issues.',
  },
  {
    sev: 'medium',
    name: 'Green plantain',
    desc: 'Must be unripe. Ripe = GI 70+ (defeats the purpose).',
  },
  {
    sev: 'medium',
    name: 'Intermittent fasting',
    desc: 'An adherence tool, not a requirement. Avoid in eating-disorder history, pregnancy, T1D, recurrent hypoglycaemia, or when training intensely.',
  },
]
