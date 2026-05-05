import { describe, expect, it } from 'vitest'
import { wrapPlatePickLabel } from './platePickLabelWrap'

describe('wrapPlatePickLabel', () => {
  it('wraps long phrases for narrow wedges', () => {
    expect(wrapPlatePickLabel('Bambara ground nut', 12)).toEqual(['Bambara', 'ground nut'])
    expect(wrapPlatePickLabel('African catfish', 12)).toEqual(['African', 'catfish'])
  })

  it('wraps more aggressively for very narrow plate columns', () => {
    expect(wrapPlatePickLabel('Bambara ground nut', 8)).toEqual(['Bambara', 'ground', 'nut'])
  })

  it('keeps short names on one line', () => {
    expect(wrapPlatePickLabel('Beef kidney', 12)).toEqual(['Beef kidney'])
  })

  it('splits very long tokens without ellipsis', () => {
    expect(wrapPlatePickLabel('abcdefghijklmno', 6)).toEqual(['abcdef', 'ghijkl', 'mno'])
  })
})
