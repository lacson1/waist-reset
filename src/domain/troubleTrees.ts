export const TROUBLE_TREES: Record<
  string,
  { title: string; steps: { head: string; body: string }[] }
> = {
  stall: {
    title: 'Weight / waist stalled',
    steps: [
      {
        head: 'Audit the last 7 days',
        body: 'Open your log. Did adherence drop below 85%? Missed fibre doses? Skipped resistance? Fix the weakest point first before adjusting calories.',
      },
      {
        head: 'Check timing, not just quantity',
        body: 'Late carbs (after 18:00) kill overnight fat oxidation. Move carbs to lunch, cut evening carbs for 7 days.',
      },
      {
        head: 'NEAT audit',
        body: 'Track steps for 3 days. If under 7,000, add a 30-min walk after dinner. NEAT is the largest controllable variable in TDEE.',
      },
      {
        head: 'Water & salt',
        body: 'New restriction = water retention. 2L water + 2–3g sodium daily. Weigh 7-day rolling avg, not single data points.',
      },
      {
        head: 'Only after the above',
        body: 'Consider dropping 100 kcal or moving to Phase 2 refeed pattern (5 days low + 2 refeed).',
      },
    ],
  },
  hunger: {
    title: 'Hunger too high',
    steps: [
      {
        head: 'Front-load protein',
        body: 'Hit 40g+ in your first meal. Eggs + Greek yoghurt + berries. Protein has 3× the satiety of carbs.',
      },
      {
        head: 'Add volume cheaply',
        body: 'Cucumber, celery, cabbage, konjac noodles, courgette — 50–100 kcal for a full plate. Fills mechanical stretch receptors.',
      },
      {
        head: 'Fibre first',
        body: '10–15 min before the meal: psyllium in water, or a bowl of broth. Gel physics do the work.',
      },
      {
        head: 'Fat at the meal',
        body: '2 tbsp EVOO or ½ avocado with the meal triggers CCK + slows gastric emptying.',
      },
      {
        head: 'Last resort',
        body: "If hunger is relentless at week 2+, you're under-eating. Eat to TDEE for 2–3 days, then resume 15% deficit (not 20%).",
      },
    ],
  },
  gi: {
    title: 'GI issues (psyllium / MCT / fibre)',
    steps: [
      {
        head: 'Psyllium bloat',
        body: 'Most common cause: not enough water. Each 5g dose = 300ml water minimum. If still bloated, drop to 2.5g × 2 for 3 days, rebuild.',
      },
      {
        head: 'MCT GI distress',
        body: "Build slowly: ½ tsp × 3 days, 1 tsp × 3 days, 1 tbsp. Don't start at 1 tbsp — guaranteed diarrhoea.",
      },
      {
        head: 'Sudden cruciferous volume',
        body: 'If broccoli/cabbage/Brussels hit you hard: cook them longer, or ferment (sauerkraut, kimchi) for 1 week — pre-digests the raffinose.',
      },
      {
        head: 'Persistent bloat >7 days',
        body: 'Drop fibre dose, add bone broth for 3 days (gut lining repair), then ramp back at 50% previous dose.',
      },
    ],
  },
  sleep: {
    title: 'Sleep is broken',
    steps: [
      {
        head: 'No caffeine after noon',
        body: 'Half-life 5–6 hours. 15:00 coffee is still active in your system at 23:00.',
      },
      {
        head: 'Last meal by 19:00',
        body: 'Late eating blunts melatonin. Non-negotiable for VAT protocol — this is as important as the calorie target.',
      },
      {
        head: 'Magnesium glycinate 300mg',
        body: '30 min before bed. Cheap, clean, supported by meta-analyses for sleep quality.',
      },
      {
        head: 'Cool + dark',
        body: 'Room ≤18°C, blackout curtains. A single night of poor sleep raises cortisol 40% — this alone halts fat loss.',
      },
      {
        head: 'If chronic',
        body: 'Drop the deficit by 10% for 7 days. Poor sleep + aggressive cut = cortisol rebound + VAT gain.',
      },
    ],
  },
  energy: {
    title: 'Low energy / fatigue',
    steps: [
      {
        head: 'Electrolytes — #1 cause',
        body: 'Add 2–3g sodium, 300mg magnesium, 200mg potassium daily during the first 2 weeks. Keto-flu fatigue is almost always this.',
      },
      {
        head: 'Check iron',
        body: 'Women especially. If fatigue + brain fog persist, request ferritin (target >50).',
      },
      {
        head: 'Thyroid check',
        body: "Cold hands, hair loss, low mood — get TSH, free T3, free T4, antibodies if you haven't in 12 months.",
      },
      {
        head: 'Carb timing, not total',
        body: "Try 40g clean carbs pre-workout (sweet potato cooled, oats) — doesn't break the protocol, restores performance.",
      },
      {
        head: 'Diet break',
        body: 'After 6 weeks of aggressive deficit, take a 7-day diet break at maintenance. Fat loss resumes faster post-break.',
      },
    ],
  },
  social: {
    title: 'Social / travel week',
    steps: [
      {
        head: "Maintain, don't cut",
        body: "Don't try to deficit AND navigate travel. Switch to maintenance (TDEE) for the week. Goal: don't go backward.",
      },
      {
        head: '3 rules only',
        body: "Protein first. 14h fast. No liquid calories (beer, juice, sugary cocktails). That's it. Drop everything else.",
      },
      {
        head: 'Pre-meal strategy',
        body: 'Before a restaurant meal: 500ml water + 2 tbsp ACV + 5g psyllium. Blunts the glucose spike dramatically.',
      },
      {
        head: 'Walk after meals',
        body: '10-min walk after each meal. Restaurant + walk = net-neutral for glucose.',
      },
      {
        head: 'Resume cleanly',
        body: 'First day back: full protocol, 16h fast, fibre doses. Do not try to punish with extra restriction — just resume.',
      },
    ],
  },
}
