import type { Baseline, ProgressState } from '../types/progress'

export function computeBMR(
  sex: string | null | undefined,
  weightKg: number | null | undefined,
  heightCm: number | null | undefined,
  age: number | null | undefined,
): number | null {
  if (!sex || weightKg == null || heightCm == null || age == null) return null
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'M' ? base + 5 : base - 161
}

export function computePersonal(baseline: Baseline | null) {
  const b = baseline || ({} as Baseline)
  const bmr = computeBMR(b.sex, b.weight, b.height, b.age)
  const act = b.activity ? parseFloat(b.activity) : null
  const tdee = bmr != null && act != null ? bmr * act : null
  const protein = b.weight != null ? Math.round(b.weight * 1.8) : null
  let p1: number | null = null
  let p2: number | null = null
  let p3: number | null = null
  if (tdee != null) {
    p1 = Math.round((tdee * 0.8) / 10) * 10
    p2 = Math.round((tdee * 0.72) / 10) * 10
    p3 = Math.round((tdee * 0.85) / 10) * 10
  }
  return { bmr, tdee, protein, p1, p2, p3 }
}

export interface PhaseInfo {
  num: number
  name: string
  week: number
  dayInPhase: number
  totalDays: number
  weeksLeft?: number
}

export function currentPhase(baseline: Baseline | null): PhaseInfo {
  const b = baseline
  if (!b?.date) return { num: 0, name: 'Pre-start', week: 0, dayInPhase: 0, totalDays: 0 }
  const start = new Date(b.date)
  const today = new Date()
  const days = Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000))
  const week = Math.floor(days / 7) + 1
  if (days < 42)
    return {
      num: 1,
      name: 'Primer',
      week,
      dayInPhase: days,
      totalDays: days,
      weeksLeft: 6 - Math.floor(days / 7),
    }
  if (days < 84)
    return {
      num: 2,
      name: 'Attack',
      week,
      dayInPhase: days - 42,
      totalDays: days,
      weeksLeft: 12 - Math.floor(days / 7),
    }
  if (days < 126)
    return {
      num: 3,
      name: 'Consolidate',
      week,
      dayInPhase: days - 84,
      totalDays: days,
      weeksLeft: 18 - Math.floor(days / 7),
    }
  return { num: 4, name: 'Maintain', week, dayInPhase: days - 126, totalDays: days, weeksLeft: 0 }
}

export function phaseKcal(phase: PhaseInfo, baseline: Baseline | null): number | null {
  const pers = computePersonal(baseline)
  if (pers.tdee == null) return null
  if (phase.num === 1) return pers.p1
  if (phase.num === 2) return pers.p2
  if (phase.num === 3) return pers.p3
  if (phase.num === 4) return Math.round(pers.tdee / 10) * 10
  return pers.p1
}

export function phaseKcalNote(p: PhaseInfo): string {
  if (p.num === 1) return 'Primer · 20% deficit · every day'
  if (p.num === 2) return 'Attack · 28% deficit (Mon–Fri) · refeed Sat/Sun'
  if (p.num === 3) return 'Consolidate · 15% deficit tapering'
  if (p.num === 4) return 'Maintenance'
  return 'Pre-start'
}

export function computeTgHdl(tg: number | null | undefined, hdl: number | null | undefined): number | null {
  if (tg != null && hdl != null && hdl > 0) return tg / hdl
  return null
}

export function computeWHtR(waist: number | null | undefined, height: number | null | undefined): number | null {
  if (waist != null && height != null && height > 0) return waist / height
  return null
}

export function greetingText(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Still up?'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Wind down'
}

export function getProgressSnapshot(state: ProgressState) {
  return { baseline: state.baseline, entries: state.entries }
}
