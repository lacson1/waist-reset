import type { ProgressEntry } from '../types/progress'

/** ISO date YYYY-MM-DD for local midnight `d`. */
function isoDateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Count consecutive calendar days ending at `now` where adherence was logged.
 * Today counts only if there is an entry for today with non-null adherence.
 */
export function adherenceLogStreak(entries: ProgressEntry[], now: Date = new Date()): number {
  const withAdh = new Set(
    entries
      .filter((e) => e.adherence != null && !Number.isNaN(e.adherence as number))
      .map((e) => e.date),
  )
  let streak = 0
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  for (;;) {
    if (withAdh.has(isoDateLocal(d))) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return streak
}
