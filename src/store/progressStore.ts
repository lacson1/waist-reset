import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { Baseline, ProgressEntry, ProgressState } from '../types/progress'
import type { CsvMeasurementRow } from '../domain/csvImport'

export const STORAGE_KEY = 'vat_progress_v1'

function normalizeEntry(e: ProgressEntry): ProgressEntry {
  return {
    ...e,
    steps: e.steps ?? null,
  }
}

function parseStored(raw: string | null): ProgressState | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as unknown
    if (data && typeof data === 'object' && 'entries' in data) {
      const o = data as Record<string, unknown>
      const rawEntries = Array.isArray(o.entries) ? (o.entries as ProgressEntry[]) : []
      return {
        baseline: (o.baseline as Baseline) ?? null,
        entries: rawEntries.map((row) => normalizeEntry(row)),
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

/** Matches legacy flat `{ baseline, entries }` in localStorage for HTML dashboard compatibility. */
const waistStorage: StateStorage = {
  getItem: () => {
    const state = parseStored(localStorage.getItem(STORAGE_KEY))
    if (!state) return null
    return JSON.stringify({ state, version: 0 })
  },
  setItem: (_name, value) => {
    try {
      const parsed = JSON.parse(value) as { state?: ProgressState }
      const s = parsed.state ?? { baseline: null, entries: [] }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ baseline: s.baseline, entries: s.entries }),
      )
    } catch {
      /* ignore */
    }
  },
  removeItem: () => localStorage.removeItem(STORAGE_KEY),
}

interface ProgressStore extends ProgressState {
  setBaseline: (b: Baseline | null) => void
  setEntries: (entries: ProgressEntry[]) => void
  upsertEntry: (entry: ProgressEntry, replace: boolean) => boolean
  deleteEntry: (date: string) => void
  resetAll: () => void
  importState: (data: ProgressState) => void
}

export const emptyBaseline = (): Baseline => ({
  date: null,
  sex: null,
  age: null,
  activity: null,
  weight: null,
  waist: null,
  height: null,
  tg: null,
  hdl: null,
  glucose: null,
  hscrp: null,
  targetWaist: null,
  targetWeight: null,
})

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      baseline: null,
      entries: [],

      setBaseline: (b) => {
        set({ baseline: b })
      },

      setEntries: (entries) => {
        set({ entries: [...entries].sort((a, b) => a.date.localeCompare(b.date)) })
      },

      upsertEntry: (entry, replace) => {
        const entries = [...get().entries]
        const i = entries.findIndex((e) => e.date === entry.date)
        if (i >= 0 && !replace) return false
        if (i >= 0) entries[i] = entry
        else entries.push(entry)
        entries.sort((a, b) => a.date.localeCompare(b.date))
        set({ entries })
        return true
      },

      deleteEntry: (date) => {
        set({ entries: get().entries.filter((e) => e.date !== date) })
      },

      resetAll: () => set({ baseline: null, entries: [] }),

      importState: (data) => {
        const entries = Array.isArray(data.entries)
          ? data.entries.map((row) => normalizeEntry(row as ProgressEntry))
          : []
        set({
          baseline: data.baseline ?? null,
          entries,
        })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => waistStorage),
      partialize: (s) => ({ baseline: s.baseline, entries: s.entries }),
    },
  ),
)

export function exportProgressJson(): string {
  const { baseline, entries } = useProgressStore.getState()
  return JSON.stringify({ baseline, entries }, null, 2)
}

export function mergeTodayChecklist(
  checklist: Record<string, boolean>,
  adherencePct: number,
): void {
  const today = new Date().toISOString().slice(0, 10)
  const entries = [...useProgressStore.getState().entries]
  const idx = entries.findIndex((e) => e.date === today)
  if (idx >= 0) {
    entries[idx] = {
      ...entries[idx],
      checklist: checklist as ProgressEntry['checklist'],
      adherence: adherencePct,
    }
  } else {
    entries.push({
      date: today,
      checklist: checklist as ProgressEntry['checklist'],
      adherence: adherencePct,
      weight: null,
      waist: null,
      steps: null,
      tg: null,
      hdl: null,
      notes: '',
    })
  }
  entries.sort((a, b) => a.date.localeCompare(b.date))
  useProgressStore.setState({ entries })
}

export function quickLogToday(
  weight: number | null,
  waist: number | null,
  steps?: number | null,
): void {
  const today = new Date().toISOString().slice(0, 10)
  const entries = [...useProgressStore.getState().entries]
  const idx = entries.findIndex((e) => e.date === today)
  if (idx >= 0) {
    const cur = entries[idx]
    entries[idx] = {
      ...cur,
      weight: weight ?? cur.weight,
      waist: waist ?? cur.waist,
      steps: steps === undefined ? (cur.steps ?? null) : steps,
    }
  } else {
    entries.push({
      date: today,
      weight,
      waist,
      steps: steps === undefined ? null : steps,
      tg: null,
      hdl: null,
      adherence: null,
      notes: '',
    })
  }
  entries.sort((a, b) => a.date.localeCompare(b.date))
  useProgressStore.setState({ entries })
}

/** Merge CSV / tracker rows into the log without wiping unrelated fields. */
export function mergeCsvMeasurements(rows: CsvMeasurementRow[]): void {
  if (rows.length === 0) return
  const entries = [...useProgressStore.getState().entries]
  for (const row of rows) {
    const idx = entries.findIndex((e) => e.date === row.date)
    if (idx >= 0) {
      const cur = entries[idx]
      entries[idx] = {
        ...cur,
        weight: row.weight !== null ? row.weight : cur.weight,
        steps: row.steps !== null ? row.steps : cur.steps ?? null,
      }
    } else {
      entries.push({
        date: row.date,
        weight: row.weight,
        waist: null,
        steps: row.steps,
        tg: null,
        hdl: null,
        adherence: null,
        notes: '',
      })
    }
  }
  entries.sort((a, b) => a.date.localeCompare(b.date))
  useProgressStore.setState({ entries })
}
