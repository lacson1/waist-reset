export type Sex = 'M' | 'F' | ''

export interface ChecklistState {
  protein?: boolean
  fasting?: boolean
  fibre?: boolean
  veg?: boolean
  steps?: boolean
  resistance?: boolean
  'no-late'?: boolean
  sleep?: boolean
}

export interface Baseline {
  date: string | null
  sex: string | null
  age: number | null
  activity: string | null
  weight: number | null
  waist: number | null
  height: number | null
  tg: number | null
  hdl: number | null
  glucose: number | null
  hscrp: number | null
  targetWaist: number | null
  targetWeight: number | null
}

export interface ProgressEntry {
  date: string
  weight: number | null
  waist: number | null
  /** Daily step count from manual entry, CSV import, or tracker export. */
  steps: number | null
  tg: number | null
  hdl: number | null
  adherence: number | null
  notes: string
  checklist?: ChecklistState
}

export interface ProgressState {
  baseline: Baseline | null
  entries: ProgressEntry[]
}
