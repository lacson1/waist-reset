import type { Baseline } from '../types/progress'
import type { PhaseInfo } from './personalisation'
import { computePersonal } from './personalisation'

export interface NextAction {
  time: string
  title: string
  detail: string
}

export function computeNextActions(phase: PhaseInfo, baseline: Baseline | null): NextAction[] {
  const h = new Date().getHours()
  const base: NextAction[] = []
  const proteinQuarter = Math.round((computePersonal(baseline).protein || 0) / 4)

  if (h < 8)
    base.push({
      time: '07:00',
      title: 'Rise · 500ml water + electrolytes',
      detail: 'Extend overnight fast. Green tea OK. No food yet.',
    })
  if (h < 10)
    base.push({
      time: '08:00',
      title: 'Light movement · 10–20 min walk',
      detail: 'Cold-fasted walk boosts fat oxidation and cortisol-rhythm alignment.',
    })
  if (h < 12)
    base.push({
      time: '11:45',
      title: 'ACV + 250ml water',
      detail: '15 min pre-meal. Straw. Acetic acid primes AMPK.',
    })
  if (h < 14)
    base.push({
      time: '12:00',
      title: 'Break fast · protein + fibre first',
      detail: `Hit ${proteinQuarter}g protein this meal. Vegetables before carbs.`,
    })
  if (h < 16)
    base.push({
      time: '15:00',
      title: 'Psyllium dose 1 · 5g + 300ml water',
      detail: 'Viscous gel reduces next-meal glucose spike.',
    })
  if (h < 18)
    base.push({
      time: '17:30',
      title: 'Resistance training',
      detail:
        phase.num === 1
          ? 'Full body × 3/week. Start 3 sets × 8-12 reps'
          : 'Progressive overload. Track weights.',
    })
  if (h < 20)
    base.push({
      time: '18:45',
      title: 'Final meal · protein + EVOO + greens',
      detail: 'Cut carbs here. Casein (Greek yoghurt/cottage cheese) for overnight MPS.',
    })
  if (h < 22)
    base.push({
      time: '20:00',
      title: 'Psyllium dose 2 · 5g + 300ml water',
      detail: 'Second dose 2+ hours from last meal.',
    })
  base.push({
    time: '22:30',
    title: 'Wind down · screens off',
    detail: 'Sleep ≥7h is a protocol component, not a bonus. Cool room, dark.',
  })
  return base.slice(0, 6)
}

export function fastStatus(): { label: string; sub: string } {
  const now = new Date()
  const h = now.getHours() + now.getMinutes() / 60
  const windowStart = 12
  const windowEnd = 19
  if (h >= windowStart && h < windowEnd) {
    const left = windowEnd - h
    return {
      label: 'Eating',
      sub: `${left.toFixed(1)}h until fast starts at 19:00`,
    }
  }
  if (h < windowStart) {
    const left = windowStart - h
    return {
      label: 'Fasting',
      sub: `${left.toFixed(1)}h until you can eat (12:00)`,
    }
  }
  const left = 24 - h + windowStart
  return {
    label: 'Fasting',
    sub: `${left.toFixed(1)}h until breakfast (12:00 tomorrow)`,
  }
}
