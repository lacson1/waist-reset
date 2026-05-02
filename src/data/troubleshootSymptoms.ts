export type TsSev = 'positive' | 'medium' | 'high' | 'critical'

export interface TroubleshootCard {
  sym: string
  cause: string
  action: string
  sev: TsSev
}

export const TROUBLESHOOT_SYMPTOMS: TroubleshootCard[] = [
  {
    sym: 'Waist down, energy good',
    cause: 'On track',
    action: 'Continue current numbers. Recalculate at 4 weeks.',
    sev: 'positive',
  },
  {
    sym: 'Weight down but waist unchanged',
    cause: 'Likely water/sodium shift, constipation, alcohol, or sleep loss',
    action: 'Check sodium, fibre intake, alcohol, sleep before changing calories.',
    sev: 'medium',
  },
  {
    sym: 'Waist unchanged for 2+ weeks',
    cause: 'Maintenance has caught up with deficit',
    action: 'Reduce calories by 100–150 OR add 2,000 steps/day. Pick one. Re-test in 14 days.',
    sev: 'high',
  },
  {
    sym: 'Hunger high, adherence falling',
    cause: 'Protein too low, meals too dry, or sleep deficit',
    action: 'Increase lean protein. Add soup-meals, fermented foods, leafy volume. Recheck protein g/kg.',
    sev: 'high',
  },
  {
    sym: 'Training performance falling',
    cause: 'Carb / total energy under-fuelled, or recovery short',
    action: 'Add a carb-day, or take a 2-week diet break at maintenance. Do not cut further.',
    sev: 'high',
  },
  {
    sym: 'TG:HDL ratio not improving',
    cause: 'Refined carbs and alcohol still present, fibre low',
    action: 'Reduce refined carbs and alcohol first. Add lentils, oats, psyllium, EVOO before cutting calories.',
    sev: 'medium',
  },
  {
    sym: 'Constipation',
    cause: 'Low water, abrupt fibre jump, missed psyllium',
    action: 'Increase water. Review psyllium dose timing. Add fermented foods + leafy volume gradually.',
    sev: 'medium',
  },
  {
    sym: 'Reflux / heartburn',
    cause: 'ACV, large fatty meals late, scotch bonnet, or PPI underuse',
    action: 'Drop ACV. Move biggest meal earlier. Reduce raw cruciferous. If persistent, see your GP.',
    sev: 'high',
  },
  {
    sym: 'Sleep poor, cortisol high',
    cause: 'Late caffeine, late meals, training too intense, screens',
    action: 'Cut caffeine after 14:00. Magnesium glycinate 200–400mg. Last meal 3hr before bed. 30-min wind-down.',
    sev: 'high',
  },
  {
    sym: 'Mood low / motivation slipping',
    cause: 'Deficit too aggressive, social isolation around food, perfectionism',
    action: 'Take a planned diet break. Allow 1–2 unrestricted social meals/week. Talk to someone if persistent.',
    sev: 'high',
  },
  {
    sym: 'Glucose / HbA1c not moving',
    cause: 'Carbs still concentrated, sleep poor, walking after meals missed',
    action: 'Walk 10 min after each meal. Move starch to training days only. Recheck protein-first meal order.',
    sev: 'medium',
  },
  {
    sym: 'Female cycle disruption',
    cause: 'Deficit too aggressive, body fat too low, training overload',
    action: 'Stop the cut immediately. Move to maintenance. Consult a GP — period loss is a red flag.',
    sev: 'critical',
  },
]

export const tsSevColor: Record<TsSev, string> = {
  positive: 'var(--positive)',
  medium: 'var(--medium)',
  high: 'var(--high)',
  critical: 'var(--negative)',
}

export const tsSevLabel: Record<TsSev, string> = {
  positive: 'OK',
  medium: 'CHECK',
  high: 'ACT',
  critical: 'STOP',
}
