import type { Baseline } from '../types/progress'
import type { FoodRow } from './foods'

export type MealTemplate = 'rest' | 'training' | 'soup'

export type HealthFocus =
  | 'weight'
  | 'glycemic'
  | 'blood_pressure'
  | 'lipid_heart'
  | 'satiety'
  | 'sodium'
  | 'digestive'

/** Stable order for pickers and prompts. */
export const HEALTH_FOCUS_ORDER: readonly HealthFocus[] = [
  'weight',
  'satiety',
  'glycemic',
  'lipid_heart',
  'blood_pressure',
  'sodium',
  'digestive',
] as const

export function isHealthFocus(value: unknown): value is HealthFocus {
  return typeof value === 'string' && (HEALTH_FOCUS_ORDER as readonly string[]).includes(value)
}

export type RestMealSlot = 'veg' | 'protein' | 'fibre'
export type TrainMealSlot = 'veg' | 'protein' | 'carbs'
export type SoupMealSlot = 'base' | 'protein' | 'leafy' | 'aromatics' | 'optional'

export type MealSlot = RestMealSlot | TrainMealSlot | SoupMealSlot

export const DEFAULT_ACTIVE_SLOT: Record<MealTemplate, MealSlot> = {
  rest: 'veg',
  training: 'veg',
  soup: 'base',
}

export function slotsForTemplate(t: MealTemplate): readonly MealSlot[] {
  switch (t) {
    case 'rest':
      return ['veg', 'protein', 'fibre']
    case 'training':
      return ['veg', 'protein', 'carbs']
    case 'soup':
      return ['base', 'protein', 'leafy', 'aromatics', 'optional']
  }
}

export function isValidSlotForTemplate(t: MealTemplate, slot: string): slot is MealSlot {
  return (slotsForTemplate(t) as readonly string[]).includes(slot)
}

/**
 * Human-readable label for a slot, scoped to its template.
 * `veg` reads as "Leafy / veg" inside soup bowls but "Vegetables" elsewhere.
 */
export function slotLabel(template: MealTemplate, slot: MealSlot): string {
  const labels: Record<string, string> = {
    veg: template === 'soup' ? 'Leafy / veg' : 'Vegetables',
    protein: 'Protein',
    fibre: 'Fibre',
    carbs: 'Slow carbs',
    base: 'Soup base',
    leafy: 'Leafy volume',
    aromatics: 'Aromatics',
    optional: 'Optional',
  }
  return labels[slot] ?? slot
}

export interface MealLineItem {
  id: string
  slot: MealSlot
  source: 'food' | 'custom'
  foodSnapshot?: FoodRow
  custom?: { label: string; kcal: number; p: number; f: number; c: number }
  portion: number
}

/**
 * Scales a reference `qty` string when the leading token is numeric (e.g. "2 large", "130g").
 * Matches how kcal/macros scale with portion so the label stays consistent with totals.
 * If there is no leading number, appends ` ×portion` so it is explicit that the row is scaled.
 */
export function scaledFoodQtyLabel(refQty: string, portion: number): string {
  const q = refQty.trim()
  if (q.length === 0) return refQty
  if (!Number.isFinite(portion) || portion <= 0) return refQty
  if (Math.abs(portion - 1) < 0.0001) return refQty

  const re = /^(\d+(?:\.\d+)?)(\s*)(.*)$/
  const m = q.match(re)
  if (!m?.[1]) return `${refQty} ×${portion.toFixed(1)}`

  const base = Number(m[1])
  if (!Number.isFinite(base)) return `${refQty} ×${portion.toFixed(1)}`

  const scaled = base * portion
  const sp = m[2] ?? ''
  const tail = (m[3] ?? '').trimEnd()

  const rounded = Math.round(scaled * 100) / 100
  const numStr =
    Math.abs(rounded - Math.round(rounded)) < 0.001 ? String(Math.round(rounded)) : String(Math.round(rounded * 10) / 10)

  return tail.length > 0 ? `${numStr}${sp}${tail}` : `${numStr}${sp}`.trimEnd()
}

export function scaledMacros(row: MealLineItem): { kcal: number; p: number; f: number; c: number } {
  const base =
    row.source === 'food' && row.foodSnapshot
      ? {
          kcal: row.foodSnapshot.kcal,
          p: row.foodSnapshot.p,
          f: row.foodSnapshot.f,
          c: row.foodSnapshot.c,
        }
      : row.custom
  if (!base) return { kcal: 0, p: 0, f: 0, c: 0 }
  const w = row.portion
  return {
    kcal: Math.round(base.kcal * w),
    p: Math.round(base.p * w * 10) / 10,
    f: Math.round(base.f * w * 10) / 10,
    c: Math.round(base.c * w * 10) / 10,
  }
}

export function sumMacros(items: MealLineItem[]) {
  return items.reduce(
    (acc, it) => {
      const s = scaledMacros(it)
      return {
        kcal: acc.kcal + s.kcal,
        p: acc.p + s.p,
        f: acc.f + s.f,
        c: acc.c + s.c,
      }
    },
    { kcal: 0, p: 0, f: 0, c: 0 },
  )
}

export function compareToPhase(
  totals: { kcal: number; p: number },
  phaseKcal: number | null,
  targetProtein: number | null,
) {
  return {
    kcalTotal: totals.kcal,
    proteinTotal: totals.p,
    pctOfDayKcal:
      phaseKcal != null && phaseKcal > 0 ? Math.round((totals.kcal / phaseKcal) * 100) : null,
    proteinVsTargetRatio:
      targetProtein != null && targetProtein > 0
        ? Math.round((totals.p / targetProtein) * 100)
        : null,
  }
}

export function carbKcalShare(totals: { kcal: number; p: number; f: number; c: number }): number {
  const carbKcal = totals.c * 4
  const denom = totals.kcal
  return denom > 0 ? Math.round((carbKcal / denom) * 100) : 0
}

export function fatKcalShare(totals: { kcal: number; f: number }): number {
  const fatKcal = totals.f * 9
  const denom = totals.kcal
  return denom > 0 ? Math.round((fatKcal / denom) * 100) : 0
}

export function mealFocusNarrative(
  focus: HealthFocus,
  totals: { kcal: number; p: number; f: number; c: number },
  compare: ReturnType<typeof compareToPhase>,
  baseline: Baseline | null,
): string[] {
  const lines: string[] = []
  const carbShare = carbKcalShare(totals)

  const fatShare = fatKcalShare(totals)

  if (focus === 'weight') {
    if (compare.pctOfDayKcal != null) {
      lines.push(
        `~${compare.pctOfDayKcal}% of phase daily kcal (${compare.kcalTotal} kcal this meal). Rest of day still counts.`,
      )
    } else {
      lines.push(`${compare.kcalTotal} kcal. Add baseline on My Progress to compare to phase.`)
    }
    if (compare.proteinVsTargetRatio != null) {
      lines.push(
        `Protein ~${compare.proteinVsTargetRatio}% of daily target (~${compare.proteinTotal} g).`,
      )
    }
  } else if (focus === 'glycemic') {
    lines.push(`~${carbShare}% of this meal’s kcal from carbs (macro estimate).`)
    if (carbShare > 45) {
      lines.push('High carb % — consider more veg/protein or less starch if you track glucose.')
    }
    if (baseline?.glucose != null) {
      lines.push('Glucose meds/targets: your care team, not this app.')
    }
  } else if (focus === 'blood_pressure') {
    lines.push('BP-friendly pattern: whole foods, sensible size vs your day (no sodium per item here).')
    if (compare.pctOfDayKcal != null && compare.pctOfDayKcal > 50) {
      lines.push('This meal is a large share of a typical day budget.')
    }
  } else if (focus === 'lipid_heart') {
    lines.push(`~${fatShare}% of this meal’s kcal from fat, ~${carbShare}% from carbs (macro estimates).`)
    if (fatShare > 55) {
      lines.push('High fat % for one meal — more veg or lean protein may rebalance the plate if that fits your plan.')
    }
    if (carbShare > 50 && fatShare > 40) {
      lines.push('Fat and carbs stack quickly — total portion often matters as much as any single macro.')
    }
  } else if (focus === 'satiety') {
    if (compare.proteinVsTargetRatio != null) {
      lines.push(
        `Protein ~${compare.proteinVsTargetRatio}% of daily target (~${compare.proteinTotal} g) — anchor for fullness.`,
      )
    } else {
      lines.push(`~${compare.proteinTotal} g protein this meal. Add weight on My Progress for a daily protein target.`)
    }
    if (compare.pctOfDayKcal != null) {
      lines.push(`~${compare.pctOfDayKcal}% of phase daily kcal — pair protein with veg volume when you can.`)
    }
    if (compare.proteinVsTargetRatio != null && compare.proteinVsTargetRatio < 45) {
      lines.push('Room to add protein or cultured dairy within your wedges if you run hungry later.')
    }
  } else if (focus === 'sodium') {
    lines.push(
      'Sodium is not listed per food here — stocks, seasoning blends, cheese, and restaurant meals often dominate.',
    )
    if (compare.pctOfDayKcal != null && compare.pctOfDayKcal > 45) {
      lines.push('Large kcal share — often goes with salty sauces; taste before adding salt at the table.')
    }
  } else {
    /* digestive */
    lines.push(
      'Gut-friendly lens: lean on veg and fibre wedges; this app does not sum fibre grams from foods.',
    )
    if (carbShare < 22 && totals.kcal > 180) {
      lines.push('Carb side is small — fine if intentional; some people prefer a modest whole-food starch with fibre wedges.')
    }
    if (compare.pctOfDayKcal != null && compare.pctOfDayKcal > 55) {
      lines.push('Very large meal — smaller plates more often can be easier on digestion for some people.')
    }
  }

  return lines
}

export function newLineId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function mealItemDisplayName(it: MealLineItem): string {
  if (it.source === 'food' && it.foodSnapshot) return it.foodSnapshot.n
  return it.custom?.label ?? '—'
}

const MAX_VISIBLE_PICKS_PER_SLOT = 2

function portionSuffixForPlate(portion: number): string {
  if (!Number.isFinite(portion) || Math.abs(portion - 1) < 0.0001) return ''
  const rounded = Math.round(portion * 10) / 10
  const asInt = Math.round(rounded)
  const num =
    Math.abs(rounded - asInt) < 0.0001 ? String(asInt) : String(rounded)
  return ` ×${num}`
}

/**
 * Full label for food picks on the plate / bowl SVG (name + optional portion).
 * Layout (line breaks, fitting inside wedges) is handled in the SVG via
 * `wrapPlatePickLabel`; we no longer ellipsis-truncate here so long food names stay visible.
 */
export function platePickLabelForDiagram(it: MealLineItem): string {
  const name = mealItemDisplayName(it).trim()
  const suffix = portionSuffixForPlate(it.portion)
  return `${name}${suffix}`.trim()
}

/**
 * One short line drawn inside a plate wedge.
 * `type` carries the raw FoodRow.t (e.g. "Protein Dense") so the SVG can
 * render the matching tinted glyph next to the label. `null` for custom lines.
 */
export interface PlatePickLine {
  label: string
  type: string | null
}

/** Short lines per slot for drawing on the plate SVG (chips on the diagram). */
export function slotPickLinesForTemplate(
  template: MealTemplate,
  items: MealLineItem[],
): Record<string, readonly PlatePickLine[]> {
  const slots = slotsForTemplate(template) as readonly string[]
  const bySlot: Record<string, PlatePickLine[]> = Object.fromEntries(
    slots.map((s) => [s, [] as PlatePickLine[]]),
  )
  for (const it of items) {
    const key = it.slot as string
    if (!bySlot[key]) continue
    const label = platePickLabelForDiagram(it)
    const type =
      it.source === 'food' && it.foodSnapshot ? (it.foodSnapshot.t ?? null) : null
    bySlot[key].push({ label, type })
  }
  for (const s of slots) {
    const picks = bySlot[s]
    if (picks.length <= MAX_VISIBLE_PICKS_PER_SLOT) {
      bySlot[s] = picks
      continue
    }
    const hidden = picks.length - MAX_VISIBLE_PICKS_PER_SLOT
    bySlot[s] = [
      ...picks.slice(0, MAX_VISIBLE_PICKS_PER_SLOT),
      { label: `+${hidden} more`, type: null },
    ]
  }
  return bySlot
}
