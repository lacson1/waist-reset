import type { Baseline, ProgressEntry, ChecklistState, ProgressState } from '../types/progress'
import { computePersonal, currentPhase } from './personalisation'

export const DEFAULT_CHECKLIST_ITEMS: {
  key: keyof ChecklistState
  label: string
  mech: string
}[] = [
  { key: 'protein', label: 'Protein first at every meal', mech: 'leucine trigger + satiety' },
  { key: 'fasting', label: '≥14h fasting window held', mech: 'autophagy + insulin reset' },
  { key: 'fibre', label: 'Psyllium / fibre × 2 doses', mech: 'bile acid + SCFA' },
  { key: 'veg', label: '≥400g vegetables', mech: 'polyphenols + micronutrients' },
  { key: 'steps', label: '≥8,000 steps', mech: 'NEAT — largest lever on TDEE' },
  { key: 'resistance', label: 'Resistance training (or scheduled rest)', mech: 'GLUT4 + LBM preservation' },
  { key: 'no-late', label: 'No eating after 19:00', mech: 'circadian metabolic rest' },
  { key: 'sleep', label: '≥7h sleep last night', mech: 'cortisol + leptin regulation' },
]

export interface RiskRow {
  label: string
  value: string
  cls: 'ok' | 'mod' | 'hi'
}

export interface RiskTierResult {
  tier: 'low' | 'mod' | 'high' | null
  score: number
  rows: RiskRow[]
}

export function riskTier(baseline: Baseline | null, entries: ProgressEntry[]): RiskTierResult {
  const b = baseline || ({} as Baseline)
  const latestWaist = entries.length ? [...entries].reverse().find((e) => e.waist != null) : null
  const waist = latestWaist?.waist ?? b.waist
  const tg = b.tg
  const hdl = b.hdl
  const glu = b.glucose
  const crp = b.hscrp

  const rows: RiskRow[] = []
  let score = 0

  if (waist != null && b.sex) {
    const hiT = b.sex === 'M' ? 102 : 88
    const modT = b.sex === 'M' ? 94 : 80
    if (waist >= hiT) {
      rows.push({ label: 'Waist', value: `${waist} cm`, cls: 'hi' })
      score += 2
    } else if (waist >= modT) {
      rows.push({ label: 'Waist', value: `${waist} cm`, cls: 'mod' })
      score += 1
    } else {
      rows.push({ label: 'Waist', value: `${waist} cm`, cls: 'ok' })
    }
  }

  const ratio = tg != null && hdl != null && hdl > 0 ? tg / hdl : null
  if (ratio != null) {
    if (ratio >= 3.5) {
      rows.push({ label: 'TG:HDL', value: ratio.toFixed(2), cls: 'hi' })
      score += 2
    } else if (ratio >= 2.0) {
      rows.push({ label: 'TG:HDL', value: ratio.toFixed(2), cls: 'mod' })
      score += 1
    } else {
      rows.push({ label: 'TG:HDL', value: ratio.toFixed(2), cls: 'ok' })
    }
  }

  if (glu != null) {
    if (glu >= 126) {
      rows.push({ label: 'Fasting Glucose', value: `${glu} mg/dL`, cls: 'hi' })
      score += 2
    } else if (glu >= 100) {
      rows.push({ label: 'Fasting Glucose', value: `${glu} mg/dL`, cls: 'mod' })
      score += 1
    } else {
      rows.push({ label: 'Fasting Glucose', value: `${glu} mg/dL`, cls: 'ok' })
    }
  }

  if (crp != null) {
    if (crp >= 3) {
      rows.push({ label: 'hs-CRP', value: `${crp} mg/L`, cls: 'hi' })
      score += 1
    } else if (crp >= 1) {
      rows.push({ label: 'hs-CRP', value: `${crp} mg/L`, cls: 'mod' })
    } else {
      rows.push({ label: 'hs-CRP', value: `${crp} mg/L`, cls: 'ok' })
    }
  }

  let tier: 'low' | 'mod' | 'high' | null = 'low'
  if (score >= 4) tier = 'high'
  else if (score >= 2) tier = 'mod'
  if (rows.length === 0) tier = null
  return { tier, score, rows }
}

export function waistSlope(entries: ProgressEntry[], days = 14): number | null {
  const cutoff = Date.now() - days * 86400000
  const recent = entries.filter((e) => e.waist != null && new Date(e.date).getTime() >= cutoff)
  if (recent.length < 4) return null
  const xs = recent.map((e) => (new Date(e.date).getTime() - new Date(recent[0].date).getTime()) / 86400000)
  const ys = recent.map((e) => e.waist as number)
  const n = xs.length
  const sx = xs.reduce((a, b) => a + b, 0)
  const sy = ys.reduce((a, b) => a + b, 0)
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0)
  const sxx = xs.reduce((a, x) => a + x * x, 0)
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx)
  return slope * 7
}

export type RecLevel = 'warn' | 'critical' | 'positive'

export interface CoachRec {
  level: RecLevel
  head: string
  detail: string
}

export function buildRecommendations(state: ProgressState): CoachRec[] {
  const b = state.baseline
  const entries = state.entries || []
  const phase = currentPhase(b)
  const recs: CoachRec[] = []

  if (!b?.date) {
    recs.push({
      level: 'warn',
      head: 'Set your baseline',
      detail:
        'Open the Progress tab and complete sex, age, height, activity, weight, and waist. The coach cannot personalise without these.',
    })
    return recs
  }

  const pers = computePersonal(b)
  if (!pers.tdee) {
    recs.push({
      level: 'warn',
      head: 'Missing personalisation inputs',
      detail:
        'Add sex, age, weight, height, and activity level to compute your personalised calorie target. Without these, you are guessing at the deficit.',
    })
  }

  const risk = riskTier(b, entries)
  if (risk.tier === 'high') {
    recs.push({
      level: 'critical',
      head: 'High metabolic risk · NAFLD / IR branch',
      detail:
        'TG:HDL ≥3.5 or fasting glucose ≥126 or waist ≥high threshold. Prioritise: (1) enforce strict 16h fast, (2) no carbs after 15:00, (3) add bitter melon / cinnamon to every meal, (4) push resistance training to 4×/week. Discuss with your physician before starting.',
    })
  } else if (risk.tier === 'mod') {
    recs.push({
      level: 'warn',
      head: 'Moderate metabolic risk',
      detail:
        'You sit above target on 1–2 markers. Lean into fibre doses (2×/day non-negotiable), green tea 3×/day, and log TG:HDL again at week 12.',
    })
  } else if (risk.tier === 'low' && risk.rows.length) {
    recs.push({
      level: 'positive',
      head: 'Low metabolic risk — protective zone',
      detail:
        'Keep the foundation: protein-first, 14h fast minimum, NEAT ≥8k steps. Focus on consolidation rather than aggression.',
    })
  }

  const slope = waistSlope(entries, 14)
  if (slope != null) {
    if (slope >= -0.05 && phase.num === 1 && phase.totalDays > 14) {
      recs.push({
        level: 'warn',
        head: 'Waist plateau detected (14-day slope ≈ 0)',
        detail:
          "You're in Phase 1 with no movement. Three levers in order: (1) audit adherence — look for missed fibre doses, (2) push NEAT to 10k steps, (3) consider early Phase 2 transition if your first bloodwork has landed.",
      })
    } else if (slope < -0.3) {
      recs.push({
        level: 'positive',
        head: `Strong fat loss trajectory (${slope.toFixed(2)} cm/wk)`,
        detail:
          'Above average. Hold current inputs, do not add more restriction. Over-aggressive cuts trigger cortisol rebound.',
      })
    } else if (slope > 0.2) {
      recs.push({
        level: 'critical',
        head: `Waist trending UP (${slope.toFixed(2)} cm/wk)`,
        detail:
          'Something has shifted — usually (a) late eating creeping in, (b) carb portions expanding, (c) stress/cortisol. Audit the last 7 days of meals and sleep.',
      })
    }
  }

  const recentAdh = entries.slice(-7).map((e) => e.adherence).filter((v): v is number => v != null)
  if (recentAdh.length >= 3) {
    const avg = recentAdh.reduce((a, b) => a + b, 0) / recentAdh.length
    if (avg < 70) {
      recs.push({
        level: 'critical',
        head: 'Adherence below 70% — results will stall here',
        detail:
          "Don't add complexity — strip it back. Pick 3 rules only this week: protein-first, 14h fast, fibre ×2. Master these before adding others back.",
      })
    } else if (avg >= 85) {
      recs.push({
        level: 'positive',
        head: `Adherence excellent (${Math.round(avg)}%)`,
        detail: 'This is where results compound. Hold pattern — consistency beats intensity.',
      })
    }
  }

  const withChecklist = entries.slice(-7).filter((e) => e.checklist)
  if (withChecklist.length >= 3) {
    const tallies: Record<string, { hit: number; total: number }> = {}
    withChecklist.forEach((e) => {
      Object.entries(e.checklist || {}).forEach(([k, v]) => {
        tallies[k] = tallies[k] || { hit: 0, total: 0 }
        tallies[k].total++
        if (v) tallies[k].hit++
      })
    })
    const weakest = Object.entries(tallies)
      .map(([k, v]) => ({ k, pct: v.hit / v.total }))
      .sort((a, b) => a.pct - b.pct)[0]
    if (weakest && weakest.pct < 0.5) {
      const item = DEFAULT_CHECKLIST_ITEMS.find((i) => i.key === weakest.k)
      if (item) {
        recs.push({
          level: 'warn',
          head: `Weak point: "${item.label}" hit on only ${Math.round(weakest.pct * 100)}% of days`,
          detail: `This is your lever. ${item.mech} — fixing this one item alone changes outcomes. Pick one friction source and remove it this week.`,
        })
      }
    }
  }

  const wl = phase.weeksLeft
  if (phase.num === 1 && wl != null && wl <= 1 && wl > 0) {
    recs.push({
      level: 'warn',
      head: `Phase 2 transition in ${wl} week(s)`,
      detail:
        'Book retest labs (TG/HDL/glucose/hs-CRP) for end of this week. Phase 2 introduces 28% deficit + weekend refeeds — you need fresh bloodwork to dial it in.',
    })
  }

  if (recs.length === 0) {
    recs.push({
      level: 'positive',
      head: 'Logging in progress',
      detail: 'Keep logging daily. After ~2 weeks the coach will surface plateaus, weak points, and phase adjustments.',
    })
  }

  return recs
}

export interface Milestone {
  done: boolean
  title: string
  sub: string
}

export function buildMilestones(state: ProgressState): Milestone[] {
  const b = state.baseline
  const entries = state.entries || []
  const phase = currentPhase(b)
  const latestWaist = entries.length ? [...entries].reverse().find((e) => e.waist != null) : null
  const waistNow = latestWaist?.waist ?? null
  const waistLost = b?.waist != null && waistNow != null ? b.waist - waistNow : 0

  return [
    { done: !!b?.date, title: 'Baseline set', sub: b?.date || '—' },
    { done: entries.length > 0, title: 'First entry logged', sub: entries.length ? entries[0].date : '—' },
    { done: entries.length >= 7, title: '7-day streak', sub: `${entries.length} entries` },
    {
      done: waistLost >= 1,
      title: '−1 cm waist',
      sub: waistLost >= 1 ? `✓ ${waistLost.toFixed(1)} cm lost` : '—',
    },
    {
      done: waistLost >= 5,
      title: '−5 cm waist',
      sub: waistLost >= 5 ? '✓ major milestone' : waistLost > 0 ? `${waistLost.toFixed(1)} cm so far` : '—',
    },
    {
      done: phase.num >= 2,
      title: 'Phase 1 complete',
      sub: phase.num >= 2 ? 'Day 42 reached' : `Day ${phase.totalDays}/42`,
    },
    {
      done: phase.num >= 3,
      title: 'Phase 2 complete',
      sub: phase.num >= 3 ? 'Day 84 reached' : phase.num === 2 ? `Day ${phase.totalDays - 42}/42` : '—',
    },
    {
      done: phase.num >= 4,
      title: 'Protocol complete',
      sub: phase.num >= 4 ? '✓ maintenance mode' : `Day ${phase.totalDays}/126`,
    },
    {
      done: !!(b?.targetWaist && waistNow != null && waistNow <= b.targetWaist),
      title: 'Target waist hit',
      sub: b?.targetWaist ? `≤${b.targetWaist} cm` : '—',
    },
  ]
}

export function coachChartVelocity(
  baseline: Baseline | null,
  entries: ProgressEntry[],
): { labels: string[]; data: number[] } {
  const b = baseline
  const waistEntries = entries.filter((e) => e.waist != null)
  const velLabels: string[] = []
  const velData: number[] = []
  if (waistEntries.length >= 2 && b?.date) {
    const start = new Date(b.date)
    const weeklyAvg: Record<number, { sum: number; count: number }> = {}
    waistEntries.forEach((e) => {
      const wk = Math.floor((new Date(e.date).getTime() - start.getTime()) / 86400000 / 7) + 1
      weeklyAvg[wk] = weeklyAvg[wk] || { sum: 0, count: 0 }
      weeklyAvg[wk].sum += e.waist as number
      weeklyAvg[wk].count++
    })
    const weeks = Object.keys(weeklyAvg)
      .map(Number)
      .sort((a, b) => a - b)
    const avgs = weeks.map((w) => weeklyAvg[w].sum / weeklyAvg[w].count)
    for (let i = 1; i < weeks.length; i++) {
      velLabels.push(`Wk ${weeks[i]}`)
      velData.push(avgs[i] - avgs[i - 1])
    }
  }
  return { labels: velLabels, data: velData }
}

export function coachChartPredicted(
  baseline: Baseline | null,
  entries: ProgressEntry[],
): { labels: string[]; actual: (number | null)[]; predicted: number[] } {
  const b = baseline
  const waistEntries = entries.filter((e) => e.waist != null)
  const predLabels: string[] = []
  const actualData: (number | null)[] = []
  const predData: number[] = []
  if (b?.date && b.waist != null) {
    const start = new Date(b.date)
    const today = new Date()
    const totalDays = Math.floor((today.getTime() - start.getTime()) / 86400000)
    const n = Math.min(126, totalDays + 7)
    for (let d = 0; d <= n; d += 7) {
      const dt = new Date(start.getTime() + d * 86400000)
      predLabels.push(dt.toISOString().slice(5, 10))
      const dWeeks = d / 7
      let pred: number
      if (dWeeks <= 6) pred = b.waist - dWeeks * 0.5
      else if (dWeeks <= 12) pred = b.waist - 6 * 0.5 - (dWeeks - 6) * 0.75
      else if (dWeeks <= 18) pred = b.waist - 6 * 0.5 - 6 * 0.75 - (dWeeks - 12) * 0.3
      else pred = b.waist - 6 * 0.5 - 6 * 0.75 - 6 * 0.3
      predData.push(pred)
      const cutoff = new Date(start.getTime() + d * 86400000)
      const priorEntries = waistEntries.filter((e) => new Date(e.date) <= cutoff)
      actualData.push(
        priorEntries.length ? priorEntries[priorEntries.length - 1].waist : null,
      )
    }
  }
  return { labels: predLabels, actual: actualData, predicted: predData }
}
