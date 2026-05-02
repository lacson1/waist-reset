export type SwapImpact = 'High' | 'Medium' | 'Low'

export type FoodSwapRow = {
  instead: string
  try: string
  why: string
  impact: SwapImpact
}

export type FoodSwapAccent = 'teal' | 'clay' | 'gold' | 'plum' | 'sage' | 'navy'

export type FoodSwapCategory = {
  id: string
  title: string
  /** Header stripe + icon tint — keeps sections visually distinct */
  accent: FoodSwapAccent
  lead?: string
  rows: FoodSwapRow[]
}

export type TopFoodSwap = {
  rank: number
  badge?: string
  title: string
  body: string
}

export const FOOD_SWAPS_INTRO = {
  eyebrow: 'Same plate, smarter inputs',
  title: 'Food Swaps',
  lead:
    'High-impact substitutions you can make today. Each swap targets a specific VAT mechanism — glucose load, fibre density, polyphenols, or fermentation. Don\'t overhaul your kitchen; replace items as they run out.',
  chips: ['9 categories', 'Mechanism-graded'] as const,
}

export const TOP_TEN_SWAPS: TopFoodSwap[] = [
  {
    rank: 1,
    badge: 'Highest leverage',
    title: 'Sugary drinks → Zobo or sparkling water + lime',
    body: 'Removes 200–400 kcal/day of pure fructose, the most VAT-driving calorie source.',
  },
  {
    rank: 2,
    title: 'White rice → Cooked-and-cooled rice, fonio, or cauliflower rice',
    body: 'Cuts the post-meal glucose spike by 30–40%. Resistant starch feeds gut bacteria.',
  },
  {
    rank: 3,
    title: 'Vegetable oil / margarine → EVOO or red palm oil (1 tbsp)',
    body: 'Swaps inflammatory linoleic acid for MUFAs, polyphenols, tocotrienols.',
  },
  {
    rank: 4,
    title: 'White bread → Sourdough or sprouted rye',
    body: 'Lower glycaemic index, more fermentation byproducts, intact bran fibre.',
  },
  {
    rank: 5,
    title: 'Fruit juice → Whole fruit + handful of nuts',
    body: 'Restores the fibre matrix and the protein/fat anchor — same flavour, no spike.',
  },
  {
    rank: 6,
    title: 'Breakfast cereal → Greek yoghurt or nono + chia + berries',
    body: '25 g protein at first meal vs 5 g; controls hunger, raises satiety hormones.',
  },
  {
    rank: 7,
    title: 'Crisps / chin-chin → Roasted chickpeas, tiger nuts, or boiled groundnuts',
    body: 'Same crunch, 3× the protein, 5× the fibre, no seed-oil load.',
  },
  {
    rank: 8,
    title: 'Bouillon cube / Maggi → Dawadawa, crayfish, smoked paprika',
    body: 'Removes ~600 mg sodium and MSG load per cube; restores umami the traditional way.',
  },
  {
    rank: 9,
    title: 'Boiled or pounded yam → Green plantain or cocoyam (small portion)',
    body: 'Lower GI, more resistant starch, holds fullness for an extra 90 min.',
  },
  {
    rank: 10,
    title: 'Late-night snack → Fasting + ginger / hibiscus tea',
    body: 'Protects the 16:8 window; insulin stays low through the overnight repair phase.',
  },
]

export const FOOD_SWAP_CATEGORIES: FoodSwapCategory[] = [
  {
    id: 'drinks',
    accent: 'teal',
    title: 'Drinks & hydration',
    lead: 'Liquid sugar bypasses every satiety signal you have. This is the single fastest way to drop visceral fat.',
    rows: [
      {
        instead: 'Coca-Cola, Fanta, Lucozade',
        try: 'Zobo (no sugar), sparkling water + lime, kombucha',
        why: 'Removes 35–55 g fructose per bottle — direct VAT precursor',
        impact: 'High',
      },
      {
        instead: 'Orange / mango juice',
        try: 'Whole orange, water + lime, hibiscus tea',
        why: 'Whole fruit fibre slows glucose by ~3×',
        impact: 'High',
      },
      {
        instead: 'Sweetened iced coffee',
        try: 'Black coffee + cinnamon, espresso + splash milk',
        why: 'Polyphenols + caffeine drive lipolysis; sugar doesn\'t',
        impact: 'Medium',
      },
      {
        instead: 'Bubble tea / milkshake',
        try: 'Greek yoghurt + cocoa + frozen berries blend',
        why: 'Same creamy hit; 25 g protein instead of 60 g sugar',
        impact: 'High',
      },
      {
        instead: 'Beer (lager, stout)',
        try: 'Dry red wine (1 glass) or sparkling water + bitters',
        why: 'Fewer carbs; resveratrol vs maltose load',
        impact: 'Medium',
      },
      {
        instead: 'Sweet tea',
        try: 'Green tea, rooibos, mint tea',
        why: 'EGCG + polyphenols; zero glucose load',
        impact: 'Medium',
      },
      {
        instead: 'Energy drinks (Red Bull, Monster)',
        try: 'Espresso + pinch of salt + lemon',
        why: 'Caffeine without the 27 g sugar bomb',
        impact: 'High',
      },
      {
        instead: 'Flavoured milk (chocolate, strawberry)',
        try: 'Plain whole milk + cinnamon, or unsweetened nono',
        why: 'Removes added sugar; fermented version aids gut',
        impact: 'Medium',
      },
    ],
  },
  {
    id: 'refined-carbs',
    accent: 'clay',
    title: 'Refined carbs & starches',
    lead: 'The biggest source of post-meal glucose spikes. Cooking starches and cooling them creates resistant starch — same dish, half the spike.',
    rows: [
      {
        instead: 'White rice (fresh)',
        try: 'Cooked-and-cooled rice, fonio, ofada rice, cauliflower rice',
        why: 'Cooling creates resistant starch (RS3); ~30% lower glucose AUC',
        impact: 'High',
      },
      {
        instead: 'White bread, baguette',
        try: 'Sourdough, sprouted rye, seeded wholegrain',
        why: 'Fermentation + intact bran lower GI by ~30%',
        impact: 'High',
      },
      {
        instead: 'Garri / fufu (large bowl)',
        try: 'Smaller portion + soup of leafy greens + protein anchor',
        why: 'Same dish; structure controls insulin response',
        impact: 'Medium',
      },
      {
        instead: 'Boiled or pounded yam',
        try: 'Green (unripe) plantain, cocoyam, cassava (cooled)',
        why: 'Lower GI, ~2 g more fibre per 100 g',
        impact: 'Medium',
      },
      {
        instead: 'Pasta (fresh)',
        try: 'Lentil pasta, cooked-and-cooled wholewheat pasta',
        why: 'Lentil-based: 2× protein, half the GI',
        impact: 'Medium',
      },
      {
        instead: 'Couscous',
        try: 'Pearl barley, freekeh, bulgur, fonio',
        why: 'Whole grain, intact bran, much higher fibre',
        impact: 'Medium',
      },
      {
        instead: 'Mashed potatoes',
        try: 'Mashed cauliflower + butter, white bean mash',
        why: 'Cuts ~60% of carb load; cauliflower adds sulforaphane',
        impact: 'Medium',
      },
      {
        instead: 'Instant noodles (Indomie etc.)',
        try: 'Shirataki, lentil noodles, or eggs + leafy greens',
        why: 'Removes seed oil + MSG seasoning packet',
        impact: 'High',
      },
      {
        instead: 'Plantain chips',
        try: 'Boiled green plantain + EVOO + chilli',
        why: 'Same flavour profile; no fryer-oil oxidation',
        impact: 'Medium',
      },
    ],
  },
  {
    id: 'breakfast',
    accent: 'gold',
    title: 'Breakfast (when you do eat one)',
    lead: "If you're not fasting, lead with 25–35 g protein. The first meal of the day sets your hunger curve for the next 12 hours.",
    rows: [
      {
        instead: 'Cornflakes / Coco Pops',
        try: 'Greek yoghurt or nono + chia + berries + walnuts',
        why: '25 g protein vs 5 g; satiety lasts 4× longer',
        impact: 'High',
      },
      {
        instead: 'Akamu / pap with sugar & milk',
        try: 'Akamu + groundnuts + boiled egg + no sugar',
        why: 'Anchors the carb with protein + fat; flatter glucose curve',
        impact: 'Medium',
      },
      {
        instead: 'Toast + jam',
        try: 'Sourdough + avocado + 2 eggs + chilli flakes',
        why: 'Protein-fat anchor + fibre; no sugar bolus',
        impact: 'High',
      },
      {
        instead: 'Croissant / pastry',
        try: 'Frittata cup, hard-boiled eggs + olives',
        why: 'Removes refined flour + seed oil + sugar trio',
        impact: 'High',
      },
      {
        instead: 'Granola',
        try: 'Steel-cut oats + cinnamon + almond butter (no sugar)',
        why: 'Most granola is candy in disguise; oats keep the structure',
        impact: 'Medium',
      },
      {
        instead: 'Pancakes / waffles + syrup',
        try: 'Banana-egg-oat pancakes (3-ingredient) + Greek yoghurt',
        why: 'Same form-factor; no maple syrup or refined flour',
        impact: 'Medium',
      },
      {
        instead: 'Smoothie bowl with juice',
        try: 'Whole fruit + protein powder + leafy green + flaxseed',
        why: 'Restores fibre matrix lost in juicing',
        impact: 'Medium',
      },
    ],
  },
  {
    id: 'snacks',
    accent: 'plum',
    title: 'Snacks & in-between',
    lead: 'Most snack cravings are habit, not hunger. If you must snack, pick one with protein or fibre — it shuts the craving down faster.',
    rows: [
      {
        instead: 'Crisps / Pringles',
        try: 'Roasted chickpeas, kale chips, popcorn (air-popped)',
        why: 'Same crunch; 4× the fibre, no oxidised seed oil',
        impact: 'High',
      },
      {
        instead: 'Chin-chin / puff puff',
        try: 'Tiger nuts, boiled groundnuts, roasted cashews',
        why: 'Whole-food crunch with MUFAs and resistant starch',
        impact: 'Medium',
      },
      {
        instead: 'Biscuits / digestives',
        try: 'Apple + almond butter, dark chocolate (85%) + walnuts',
        why: 'Same sweet+fat hit; whole foods + polyphenols',
        impact: 'Medium',
      },
      {
        instead: 'Milk chocolate bar',
        try: '2 squares 85% dark chocolate + a few raspberries',
        why: 'Less sugar, more flavanols, satisfies in smaller dose',
        impact: 'Medium',
      },
      {
        instead: 'Granola bar / cereal bar',
        try: 'Hard-boiled egg + handful of olives, beef jerky (low-sugar)',
        why: 'Real protein bar — most marketed bars are candy',
        impact: 'Medium',
      },
      {
        instead: 'Ice cream',
        try: 'Frozen banana + cocoa blend, Greek yoghurt + frozen mango',
        why: 'Same cold-creamy texture; protein and fibre',
        impact: 'Medium',
      },
      {
        instead: 'Sweet popcorn',
        try: 'Air-popped popcorn + EVOO + sea salt + nutritional yeast',
        why: 'Whole grain, no caramel coating, B-vitamin boost',
        impact: 'Low',
      },
    ],
  },
  {
    id: 'oils',
    accent: 'sage',
    title: 'Cooking oils & fats',
    lead: 'The fat you cook with goes into every meal. Refined seed oils oxidise at high heat and drive systemic inflammation — VAT thrives on it.',
    rows: [
      {
        instead: 'Sunflower / corn / canola oil',
        try: 'Extra-virgin olive oil, red palm oil (1 tbsp/day)',
        why: 'MUFAs + tocotrienols + polyphenols; lower omega-6 load',
        impact: 'High',
      },
      {
        instead: 'Margarine / spreads',
        try: 'Butter (grass-fed), avocado, EVOO drizzle',
        why: 'Removes industrial trans fats and emulsifiers',
        impact: 'High',
      },
      {
        instead: 'Vegetable oil for frying',
        try: 'Avocado oil, ghee, beef tallow, coconut oil',
        why: 'Higher smoke point, more oxidation-stable',
        impact: 'Medium',
      },
      {
        instead: 'Mayonnaise',
        try: 'Greek yoghurt + mustard + lemon, EVOO mayo',
        why: 'Same creamy texture; protein anchor + fewer seed oils',
        impact: 'Medium',
      },
      {
        instead: 'Coffee creamer (powdered)',
        try: 'Whole milk, oat milk (no oil), splash of cream',
        why: 'Removes hydrogenated fats and sugar',
        impact: 'Medium',
      },
    ],
  },
  {
    id: 'sauces',
    accent: 'navy',
    title: 'Sauces, dressings & seasonings',
    lead: 'A "healthy" salad with the wrong dressing has more sugar than a doughnut. The seasoning aisle is where most hidden sugar and seed oil hides.',
    rows: [
      {
        instead: 'Maggi / Knorr cubes',
        try: 'Dawadawa, iru, smoked paprika, dried crayfish',
        why: 'Real fermented umami; cuts ~600 mg sodium per cube',
        impact: 'High',
      },
      {
        instead: 'Ketchup / sweet chilli',
        try: 'Salsa, harissa, scotch bonnet pepper sauce (no sugar)',
        why: 'Removes 4 g sugar per tbsp; capsaicin lifts thermogenesis',
        impact: 'Medium',
      },
      {
        instead: 'Bottled salad dressing',
        try: 'EVOO + lemon / vinegar + mustard + herbs',
        why: 'No emulsifiers, sugar, or rancid oils',
        impact: 'Medium',
      },
      {
        instead: 'BBQ sauce',
        try: 'Suya spice (yaji) rub, Cajun blend, garlic+chilli paste',
        why: 'Dry rubs add flavour without sugar',
        impact: 'Medium',
      },
      {
        instead: 'Sweet teriyaki',
        try: 'Tamari / coconut aminos + ginger + garlic + lime',
        why: 'Same umami profile, no sugar syrup',
        impact: 'Medium',
      },
      {
        instead: 'Honey mustard',
        try: 'Dijon mustard + EVOO + lemon',
        why: 'Same tang; removes the honey hit',
        impact: 'Low',
      },
    ],
  },
  {
    id: 'takeaway',
    accent: 'gold',
    title: 'Takeaway & restaurant orders',
    lead: 'You can eat out 2–3× a week without breaking the protocol. Order the protein + vegetables; ask for the carb on the side or skip it.',
    rows: [
      {
        instead: 'Jollof rice + fried chicken',
        try: 'Grilled tilapia or suya + side of leafy salad + small jollof',
        why: 'Halves the carb portion; doubles the leafy volume',
        impact: 'Medium',
      },
      {
        instead: 'Pizza (large)',
        try: 'Two slices + large salad with EVOO + olives',
        why: 'Same craving satisfied; fibre-first protocol',
        impact: 'Medium',
      },
      {
        instead: 'Burger + fries + Coke',
        try: 'Bunless burger + side salad + sparkling water',
        why: 'Removes refined-flour bun + fryer oil + sugar drink',
        impact: 'High',
      },
      {
        instead: 'Sweet & sour Chinese',
        try: 'Steamed fish + greens + tamari, beef + broccoli (no rice or small)',
        why: 'No corn-starch sauce; no candy-glaze sugar',
        impact: 'Medium',
      },
      {
        instead: 'Indian — naan + butter chicken',
        try: 'Tandoori protein + saag paneer + small basmati or no rice',
        why: 'Fibre-rich vegetables + grilled protein anchor',
        impact: 'Medium',
      },
      {
        instead: 'Sushi roll combos',
        try: 'Sashimi + edamame + miso soup + seaweed salad',
        why: 'Skips the white-rice load entirely',
        impact: 'Medium',
      },
      {
        instead: 'Wrap with chips',
        try: 'Grilled-chicken bowl + greens + salsa + avocado',
        why: 'Same components, no flour wrap or fryer oil',
        impact: 'Medium',
      },
      {
        instead: 'Mocha frappuccino',
        try: 'Iced americano + splash of milk + cinnamon',
        why: 'Removes 50 g sugar from a single drink',
        impact: 'High',
      },
    ],
  },
  {
    id: 'desserts',
    accent: 'plum',
    title: 'Sweet treats & desserts',
    lead: 'A nightly dessert habit is the second-biggest VAT driver after sugary drinks. These swaps preserve the ritual without the metabolic cost.',
    rows: [
      {
        instead: 'Cake slice',
        try: 'Greek yoghurt + cocoa + berries + crushed walnut',
        why: 'Same dessert hit; protein + fibre instead of flour + sugar',
        impact: 'Medium',
      },
      {
        instead: 'Doughnut / mandazi',
        try: 'Two squares 85% dark chocolate + tea',
        why: '10× less sugar, polyphenols, real cocoa fat',
        impact: 'High',
      },
      {
        instead: 'Sticky toffee pudding',
        try: 'Baked apple + cinnamon + Greek yoghurt',
        why: 'Same warm + sweet ritual, no sugar bomb',
        impact: 'Medium',
      },
      {
        instead: 'Cheesecake',
        try: 'Greek yoghurt + lemon zest + berries + almond crumble',
        why: 'Same creamy-tangy profile; quarter the sugar',
        impact: 'Medium',
      },
      {
        instead: 'Sweets / pic-n-mix',
        try: 'Frozen grapes, Medjool date stuffed with almond butter',
        why: 'Whole-food sugar with fibre or fat anchor',
        impact: 'Medium',
      },
      {
        instead: 'Sweet popsicle',
        try: 'Frozen banana coins + dark chocolate drizzle',
        why: 'Same cold-sweet hit; whole fruit + flavanols',
        impact: 'Low',
      },
    ],
  },
  {
    id: 'african-staples',
    accent: 'sage',
    title: 'African staple swaps (extended)',
    lead: 'Same dish, smarter swaps within the same cuisine. Keep the family table; lower the visceral-fat load.',
    rows: [
      {
        instead: 'Eba / fufu (large bowl)',
        try: 'Smaller wrap-sized portion + double soup volume + protein',
        why: 'Keeps the dish; cuts glucose load by 40%',
        impact: 'Medium',
      },
      {
        instead: 'Pounded yam',
        try: 'Pounded green plantain + cocoyam blend',
        why: 'Same texture, lower GI, more resistant starch',
        impact: 'Medium',
      },
      {
        instead: 'Plain jollof',
        try: 'Fonio jollof, ofada-rice jollof, cooked-and-cooled rice jollof',
        why: 'Slower glucose, more fibre, traditional grain options',
        impact: 'High',
      },
      {
        instead: 'Egusi with palm oil overload',
        try: 'Egusi with 1 tbsp red palm oil + double the leafy greens',
        why: 'Keeps tocotrienols; volumes up the fibre',
        impact: 'Medium',
      },
      {
        instead: 'Moin moin (deep-fried bean cake)',
        try: 'Steamed moin moin in leaves, ákàrà air-fried',
        why: 'Same protein, no oxidised fryer oil',
        impact: 'Medium',
      },
      {
        instead: 'Fried plantain (dodo)',
        try: 'Boiled green plantain + chilli + EVOO drizzle',
        why: 'Half the GI, no fryer oil, same flavour notes',
        impact: 'Medium',
      },
      {
        instead: 'Suya with fried yam',
        try: 'Suya + grilled vegetables + tomato salad',
        why: 'Drops the fryer carb; doubles the vegetable load',
        impact: 'Medium',
      },
      {
        instead: 'Meat pie / Scotch egg',
        try: 'Hard-boiled eggs + roasted groundnuts',
        why: 'Same protein-fat snack, no refined-flour pastry',
        impact: 'Medium',
      },
    ],
  },
]

export const WHY_FOOD_SWAPS = {
  title: 'Why food swaps beat calorie counting',
  pillars: [
    {
      subtitle: 'Same ritual, new mechanism',
      text: "You're not removing eating moments — you're changing what fills them. Habits stick when the cue and reward stay.",
    },
    {
      subtitle: 'Mechanism > calories',
      text: '200 kcal of biscuits and 200 kcal of nuts behave differently in the body. Insulin response, satiety hormones, and gut microbiome diverge sharply.',
    },
    {
      subtitle: 'Compounding wins',
      text: 'One swap is small. Eight swaps daily, repeated across 16 weeks, is roughly a thousand better decisions — that\'s where VAT loss compounds.',
    },
    {
      subtitle: 'Sustainability beats severity',
      text: 'Strict diets fail by month 3. Swaps survive holidays, stress, parties — the conditions that decide long-term outcomes.',
    },
  ],
  rule:
    'Rule of thumb: stack one new swap per week. By week 10 you\'ll have ten compounding wins without ever feeling like you\'re "on a diet."',
}
