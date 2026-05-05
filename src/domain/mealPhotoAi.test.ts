import { describe, expect, it } from 'vitest'
import { extractChatContent, parseMealVisionJson } from './mealPhotoAi'

describe('parseMealVisionJson', () => {
  it('parses a minimal valid response', () => {
    const r = parseMealVisionJson(
      '{"estimated_kcal": 420, "estimated_protein_g": 30, "estimated_carbs_g": 40, "estimated_fat_g": 12, "confidence": "medium", "items_guess": ["rice"], "notes": "ok", "swaps": []}',
    )
    expect(r).not.toBeNull()
    expect(r!.estimated_kcal).toBe(420)
    expect(r!.estimated_protein_g).toBe(30)
    expect(r!.confidence).toBe('medium')
    expect(r!.items_guess).toEqual(['rice'])
  })

  it('strips a ```json fence', () => {
    const r = parseMealVisionJson(
      '```json\n{"estimated_kcal": 100, "estimated_protein_g": 5, "estimated_carbs_g": 10, "estimated_fat_g": 2, "confidence": "low", "items_guess": [], "notes": "", "swaps": []}\n```',
    )
    expect(r).not.toBeNull()
    expect(r!.estimated_kcal).toBe(100)
  })

  it('coerces missing macro fields to 0 instead of NaN', () => {
    const r = parseMealVisionJson('{"estimated_kcal": 200, "confidence": "low"}')
    expect(r).not.toBeNull()
    expect(r!.estimated_protein_g).toBe(0)
    expect(r!.estimated_carbs_g).toBe(0)
    expect(r!.estimated_fat_g).toBe(0)
    expect(Number.isNaN(r!.estimated_protein_g)).toBe(false)
  })

  it('clamps negative macros to 0', () => {
    const r = parseMealVisionJson(
      '{"estimated_kcal": 200, "estimated_protein_g": -5, "estimated_carbs_g": -1, "estimated_fat_g": 0, "confidence": "low"}',
    )
    expect(r).not.toBeNull()
    expect(r!.estimated_protein_g).toBe(0)
    expect(r!.estimated_carbs_g).toBe(0)
  })

  it('rejects when kcal is missing or non-finite', () => {
    expect(parseMealVisionJson('{"confidence": "low"}')).toBeNull()
    expect(parseMealVisionJson('{"estimated_kcal": "soup"}')).toBeNull()
    expect(parseMealVisionJson('{"estimated_kcal": -10}')).toBeNull()
  })

  it('falls back to "low" for unknown confidence', () => {
    const r = parseMealVisionJson('{"estimated_kcal": 100, "confidence": "very-very-high"}')
    expect(r!.confidence).toBe('low')
  })

  it('normalises confidence casing', () => {
    const r = parseMealVisionJson('{"estimated_kcal": 100, "confidence": "MEDIUM"}')
    expect(r!.confidence).toBe('medium')
  })

  it('returns null for non-JSON content', () => {
    expect(parseMealVisionJson('I am not JSON')).toBeNull()
    expect(parseMealVisionJson('{ broken json')).toBeNull()
  })
})

describe('extractChatContent', () => {
  it('reads choices[0].message.content', () => {
    expect(
      extractChatContent(
        JSON.stringify({ choices: [{ message: { content: 'hello' } }] }),
      ),
    ).toBe('hello')
  })

  it('returns null for non-JSON', () => {
    expect(extractChatContent('not json')).toBeNull()
  })

  it('returns null when content is missing', () => {
    expect(extractChatContent(JSON.stringify({ choices: [{}] }))).toBeNull()
  })
})
