import { describe, expect, it } from 'vitest'
import type { ProgressEntry } from '../types/progress'
import { adherenceLogStreak } from './adherenceStreak'

function entry(date: string, adherence: number | null): ProgressEntry {
  return {
    date,
    weight: null,
    waist: null,
    steps: null,
    tg: null,
    hdl: null,
    adherence,
    notes: '',
  }
}

describe('adherenceLogStreak', () => {
  it('counts consecutive days ending today', () => {
    const today = new Date('2026-05-10T12:00:00')
    const entries: ProgressEntry[] = [
      entry('2026-05-08', 80),
      entry('2026-05-09', 75),
      entry('2026-05-10', 90),
    ]
    expect(adherenceLogStreak(entries, today)).toBe(3)
  })

  it('stops at first gap', () => {
    const today = new Date('2026-05-10T12:00:00')
    const entries: ProgressEntry[] = [
      entry('2026-05-07', 70),
      entry('2026-05-09', 75),
      entry('2026-05-10', 90),
    ]
    expect(adherenceLogStreak(entries, today)).toBe(2)
  })
})
