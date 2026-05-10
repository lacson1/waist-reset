import { describe, expect, it } from 'vitest'
import { coerceIsoDate, parseMeasurementsCsv, splitCsvLine } from './csvImport'

describe('splitCsvLine', () => {
  it('handles quoted commas', () => {
    expect(splitCsvLine('a,"b,c",d')).toEqual(['a', 'b,c', 'd'])
  })
})

describe('coerceIsoDate', () => {
  it('accepts ISO dates', () => {
    expect(coerceIsoDate('2026-03-01')).toBe('2026-03-01')
  })
  it('accepts M/D/YYYY', () => {
    expect(coerceIsoDate('3/7/2026')).toBe('2026-03-07')
  })
})

describe('parseMeasurementsCsv', () => {
  it('parses header and merges duplicate dates (last wins)', () => {
    const csv = [
      'date,weight,steps',
      '2026-01-01,80,',
      '2026-01-01,,9000',
      '2026-01-02,79.5,8200',
    ].join('\n')
    const { rows, errors } = parseMeasurementsCsv(csv)
    expect(errors.length).toBe(0)
    expect(rows).toEqual([
      { date: '2026-01-01', weight: 80, steps: 9000 },
      { date: '2026-01-02', weight: 79.5, steps: 8200 },
    ])
  })
})
