export const EATOUT_SCENARIOS: {
  scenario: string
  pick: string
  avoid: string
  cuisine: string
}[] = [
  {
    scenario: 'Suya / Mai Suya stand',
    pick: 'Beef or chicken suya, no peanut crust overload. Side of raw onion + tomato + cabbage. Skip the white bread.',
    avoid: 'Sugary soft drinks, deep-fried plantain mountain.',
    cuisine: 'African',
  },
  {
    scenario: 'Buka / Mama Put',
    pick: 'Pepper soup with fish or goat. Egusi or efo riro with assorted lean meat. Half-portion of pounded yam or eba.',
    avoid: 'Multiple swallow types in one sitting; stew with deep-orange palm oil layer (likely refined).',
    cuisine: 'African',
  },
  {
    scenario: 'Wedding / event',
    pick: 'Jollof rice (small portion) + grilled chicken + salad + asun. Drink water or zobo.',
    avoid: 'Multiple plates, sugary drinks, dessert table laps.',
    cuisine: 'African',
  },
  {
    scenario: 'Wagamama / pan-Asian',
    pick: 'Tofu / chicken / salmon teriyaki + edamame + side salad. Brown rice if available.',
    avoid: 'Katsu curry, sweet sauces, sugary cocktails.',
    cuisine: 'Asian',
  },
  {
    scenario: 'Italian',
    pick: 'Grilled fish or chicken + side of vegetables. Caprese salad. EVOO + lemon dressing. Half-portion of pasta if you train that day.',
    avoid: 'Bread basket, creamy carbonara, tiramisu, fortified wine cocktails.',
    cuisine: 'Mediterranean',
  },
  {
    scenario: 'Greek / Lebanese',
    pick: 'Grilled meat skewers + Greek salad + tzatziki. Hummus + raw veg. Olives + feta.',
    avoid: 'Pita bread refills, baklava, sugary lemonade.',
    cuisine: 'Mediterranean',
  },
  {
    scenario: 'Pub / British carvery',
    pick: 'Roast chicken or beef (lean cuts) + double vegetables + small Yorkshire pudding. Skip the gravy boat.',
    avoid: 'Pints of lager, fish and chips, sticky toffee pudding.',
    cuisine: 'British',
  },
  {
    scenario: 'Pret / Leon / fast casual',
    pick: 'Hot box with salmon/chicken + greens + chickpeas. Small black coffee or sparkling water.',
    avoid: 'Smoothies (sugar bomb), wraps with mayo-heavy fillings, baked goods.',
    cuisine: 'Fast casual',
  },
  {
    scenario: 'Travel / hotel breakfast',
    pick: 'Eggs (any style) + smoked salmon + tomato + avocado + black coffee. Greek yoghurt with berries.',
    avoid: 'Continental pastries, breakfast cereals, fruit juice.',
    cuisine: 'Hotel',
  },
  {
    scenario: 'Long-haul flight',
    pick: 'Pre-order low-sodium meal. Bring almonds, biltong, fruit. Drink water aggressively.',
    avoid: 'Alcohol (dehydrating), the dessert tray, the second bread roll.',
    cuisine: 'Travel',
  },
  {
    scenario: 'Drinks with friends',
    pick: 'Spirit + soda + lime, OR a single dry red wine. Ask for olives, nuts, or vegetables to graze.',
    avoid: 'Beer pints (liquid carbs), sugary cocktails, late-night kebab.',
    cuisine: 'Social',
  },
  {
    scenario: 'Family Sunday lunch',
    pick: 'Roast meat + vegetables. One small starch. Skip the second helping; ask for leftovers to take home.',
    avoid: 'Three desserts because relatives insist; aim for a smaller piece rather than refusing outright.',
    cuisine: 'Social',
  },
]

export type ShopTier = 'standard' | 'budget' | 'premium'

export const SHOPPING: Record<string, Record<ShopTier, string[]>> = {
  'Lean protein': {
    budget: ['Eggs (12-pack)', 'Tinned sardines / mackerel', 'Chicken thighs', 'Tinned chickpeas', 'Lentils (dry)', 'Tofu'],
    standard: [
      'Eggs',
      'Tinned sardines / mackerel',
      'Chicken thighs',
      'Tilapia / sea bass',
      'Greek yoghurt 0%',
      'Stockfish (rehydrated)',
      'Lentils, chickpeas, black beans',
    ],
    premium: [
      'Wild-caught salmon',
      'Anchovies in EVOO',
      'Skyr',
      'Pasture-raised eggs',
      'Wild stockfish',
      'Mussels',
      'Goat meat (halal butcher)',
      'Whey isolate (third-party tested)',
    ],
  },
  Vegetables: {
    budget: ['Frozen spinach', 'Frozen broccoli', 'Cabbage', 'Tinned tomatoes', 'Carrots', 'Onions', 'Bell peppers'],
    standard: [
      'Spinach',
      'Broccoli',
      'Cauliflower',
      'Tomatoes',
      'Cucumber',
      'Bell peppers',
      'Cabbage',
      'Mushrooms',
      'Ugu / ewedu (frozen if fresh unavailable)',
    ],
    premium: [
      'Watercress',
      'Kale (organic)',
      'Asparagus',
      'Brussels sprouts',
      'Artichoke',
      'Endive',
      'Fresh ugu / amaranth / cassava leaves',
      'Heirloom tomatoes',
    ],
  },
  'Slow carbs': {
    budget: ['Lentils (dry)', 'Oats (steel-cut)', 'Sweet potato', 'Plantain (green)', 'Chickpeas (dry)'],
    standard: ['Lentils', 'Sweet potato', 'Green plantain', 'Black beans', 'Quinoa', 'Pearled barley'],
    premium: ['Teff', 'Fonio', 'Sorghum', 'Bambara groundnut', 'Ukwa (African breadfruit)', 'Wild rice'],
  },
  'Healthy fats': {
    budget: ['Sunflower seeds', 'Peanut butter (no sugar)', 'Vegetable oil for cooking + small EVOO bottle for finishing'],
    standard: ['EVOO (mid-range)', 'Avocado', 'Almonds', 'Walnuts', 'Tahini', 'Chia seeds', 'Flaxseed (ground)'],
    premium: [
      'Single-estate EVOO (cold-pressed)',
      'Macadamia nuts',
      'Pistachios',
      'Brazil nuts',
      'Tiger nuts',
      'Unrefined red palm oil (small bottle)',
      'Hemp seeds',
    ],
  },
  'Thermogenic / herbs': {
    budget: ['Black pepper', 'Cayenne', 'Garlic', 'Ginger', 'Mustard', 'Dried mixed herbs'],
    standard: [
      'Garlic (fresh + powder)',
      'Ginger (fresh)',
      'Cayenne',
      'Black pepper',
      'Ceylon cinnamon',
      'Turmeric',
      'Cloves',
      'Scotch bonnet (fresh or frozen)',
      'ACV (with the mother)',
    ],
    premium: [
      'Fresh turmeric root',
      'Saffron',
      'Smoked paprika',
      'Sumac',
      'Uda / negro pepper',
      'Ehuru / calabash nutmeg',
      'Alligator pepper',
      'Yaji / suya spice (homemade)',
    ],
  },
  'Hydration / drinks': {
    budget: ['Tap water', 'Tea bags (green / black)', 'Instant coffee'],
    standard: ['Loose-leaf green tea', 'Hibiscus / zobo flowers', 'Ground coffee (filter)', 'Sparkling water'],
    premium: ['Single-origin coffee beans', 'Matcha', 'Premium loose-leaf green tea', 'Herbal infusions (rose hip, peppermint)'],
  },
  'Fermented / dairy': {
    budget: ['Plain yoghurt', 'Cheese (block, not pre-grated)'],
    standard: ['Greek yoghurt 0% / 5%', 'Cottage cheese', 'Kefir', 'Sauerkraut (refrigerated, not pasteurised)', 'Nono'],
    premium: ['Skyr', 'Quark', 'Kimchi (refrigerated)', 'Wara (Nigerian cheese)', "Goat's milk yoghurt", 'Aged hard cheese (small portion)'],
  },
  'Fibre / volume helpers': {
    budget: ['Psyllium husk (large bag)', 'Konjac noodles', 'Frozen mixed berries'],
    standard: ['Psyllium husk', 'Konjac noodles', 'Baobab powder', 'Chia + flax', 'Frozen blueberries / strawberries', 'Apples'],
    premium: ['Organic baobab', 'Wild blueberries (frozen)', 'Pomegranate (whole fruit, in season)', 'Fresh berries'],
  },
}

export const TIER_DESCS: Record<ShopTier, string> = {
  budget:
    "Budget tier: tight spend, frozen/tinned where it doesn't hurt. Proves the protocol works without premium pricing.",
  standard: 'Standard tier: balanced cost-to-quality. Sourced from major supermarkets and African food shops.',
  premium:
    'Premium tier: highest-quality versions where it matters most (oils, fish, fermented foods, single-origin).',
}
