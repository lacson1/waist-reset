/** Measurement rows parsed from a CSV (e.g. Apple Health / spreadsheet export). */
export interface CsvMeasurementRow {
  date: string
  weight: number | null
  steps: number | null
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Split a CSV line respecting quoted fields. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQ = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQ = true
    } else if (c === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

function pickColumnIndex(
  headers: string[],
  patterns: readonly string[],
): number {
  const norm = headers.map(normalizeHeader)
  for (const p of patterns) {
    const want = normalizeHeader(p)
    const i = norm.findIndex((h) => h === want || h.includes(want) || want.includes(h))
    if (i >= 0) return i
  }
  return -1
}

function parseNum(cell: string): number | null {
  const s = cell.trim().replace(/,/g, '')
  if (!s) return null
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : null
}

/** Normalize various date cells to YYYY-MM-DD when possible. */
export function coerceIsoDate(cell: string): string | null {
  const s = cell.trim()
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const mdY = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s)
  if (mdY) {
    const mm = mdY[1].padStart(2, '0')
    const dd = mdY[2].padStart(2, '0')
    const yyyy = mdY[3]
    return `${yyyy}-${mm}-${dd}`
  }
  const t = Date.parse(s)
  if (!Number.isNaN(t)) return new Date(t).toISOString().slice(0, 10)
  return null
}

/**
 * Parse CSV text into measurement rows. Unknown columns ignored.
 * Expects a header row with date + optional weight / steps columns.
 */
export function parseMeasurementsCsv(text: string): {
  rows: CsvMeasurementRow[]
  errors: string[]
} {
  const errors: string[] = []
  const lines = text.split(/\r?\n/).filter((ln) => ln.trim().length > 0)
  if (lines.length < 2) {
    errors.push('CSV needs a header row and at least one data row.')
    return { rows: [], errors }
  }
  const headers = splitCsvLine(lines[0])
  const iDate = pickColumnIndex(headers, [
    'date',
    'day',
    'start date',
    'time',
    'timestamp',
  ])
  const iWeight = pickColumnIndex(headers, [
    'weight',
    'weight (kg)',
    'kg',
    'body mass',
    'value', // Apple Health sometimes uses generic "value" with weight quantity
  ])
  const iSteps = pickColumnIndex(headers, [
    'steps',
    'step count',
    'walking steps',
    'walking + running distance', // won't match steps — user may rename
  ])

  if (iDate < 0) {
    errors.push('Could not find a date column (try "date" or YYYY-MM-DD).')
    return { rows: [], errors }
  }
  if (iWeight < 0 && iSteps < 0) {
    errors.push('Could not find weight or steps columns.')
    return { rows: [], errors }
  }

  const byDate = new Map<string, CsvMeasurementRow>()
  for (let li = 1; li < lines.length; li++) {
    const cells = splitCsvLine(lines[li])
    const dateRaw = cells[iDate] ?? ''
    const date = coerceIsoDate(dateRaw)
    if (!date) {
      errors.push(`Line ${li + 1}: bad date "${dateRaw}"`)
      continue
    }
    const weight = iWeight >= 0 ? parseNum(cells[iWeight] ?? '') : null
    const steps = iSteps >= 0 ? parseNum(cells[iSteps] ?? '') : null
    if (weight == null && steps == null) continue
    const prev = byDate.get(date)
    byDate.set(date, {
      date,
      weight: weight !== null ? weight : (prev?.weight ?? null),
      steps: steps !== null ? steps : (prev?.steps ?? null),
    })
  }
  const rows = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
  return { rows, errors }
}
