import type { HealthFocus } from './plateMeal'

export interface MealVisionEstimate {
  estimated_kcal: number
  estimated_protein_g: number
  estimated_carbs_g: number
  estimated_fat_g: number
  confidence: string
  items_guess: string[]
  notes: string
  swaps: string[]
  narrative?: string
}

export async function compressImageToJpegDataUrl(file: File, maxEdge: number): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    const w = bitmap.width
    const h = bitmap.height
    const scale = Math.min(1, maxEdge / Math.max(w, h))
    const cw = Math.max(1, Math.round(w * scale))
    const ch = Math.max(1, Math.round(h * scale))
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No canvas context')
    ctx.drawImage(bitmap, 0, 0, cw, ch)
    return canvas.toDataURL('image/jpeg', 0.82)
  } finally {
    bitmap.close()
  }
}

export function buildVisionSystemPrompt(): string {
  return [
    'You estimate visible food portions for a wellness app.',
    'You are not a medical device. Do not diagnose. Use conservative estimates when uncertain.',
    'Reply with a single JSON object only (no markdown fences), keys exactly:',
    '{"estimated_kcal":number,"estimated_protein_g":number,"estimated_carbs_g":number,"estimated_fat_g":number,',
    '"confidence":"low"|"medium"|"high",',
    '"items_guess":string[],"notes":string,"swaps":string[],"narrative":string}',
    'Numbers must be reasonable for one plate or bowl. If the image is not food, set confidence to "low" and explain in notes.',
  ].join(' ')
}

const HEALTH_FOCUS_FOR_PROMPT: Record<HealthFocus, string> = {
  weight: 'weight / calories and protein vs daily targets',
  glycemic: 'blood sugar and carbohydrate load',
  blood_pressure: 'blood-pressure-friendly patterns and portion size',
  lipid_heart: 'fat and carbohydrate balance (heart-health framing, not medical advice)',
  satiety: 'fullness and protein vs daily target',
  sodium: 'lower-sodium eating (hidden salt, meal size)',
  digestive: 'gentle / gut-friendly plating (veg and fibre wedges, no fibre totals)',
}

export function buildVisionUserText(context: {
  healthFocus: HealthFocus
  phaseKcal: number | null
  targetProtein: number | null
}): string {
  const parts = [
    `User focus mode (for wording only): ${HEALTH_FOCUS_FOR_PROMPT[context.healthFocus]}.`,
    context.phaseKcal != null ? `Their approximate daily phase kcal target: ${context.phaseKcal}.` : 'No daily kcal target on file.',
    context.targetProtein != null
      ? `Approximate daily protein target from weight: ${context.targetProtein} g.`
      : 'No protein target on file.',
    'Estimate this meal. In narrative (2–3 sentences), say how this meal might sit vs their targets for their focus mode, without medical claims.',
    'In swaps, suggest 1–3 concrete swaps aligned with their focus (e.g. smaller starch, more veg, less fried).',
  ]
  return parts.join(' ')
}

/** Coerce to a finite, non-negative number. Returns 0 for missing/NaN/negative input. */
function nonNegNumber(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

const VISION_CONFIDENCE_VALUES = new Set(['low', 'medium', 'high'])

export function parseMealVisionJson(content: string): MealVisionEstimate | null {
  let s = content.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(s)
  if (fence) s = fence[1].trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  s = s.slice(start, end + 1)
  try {
    const o = JSON.parse(s) as unknown
    if (!o || typeof o !== 'object') return null
    const r = o as Record<string, unknown>
    const kcal = Number(r.estimated_kcal)
    if (!Number.isFinite(kcal) || kcal < 0) return null
    const rawConfidence = String(r.confidence ?? 'low').toLowerCase()
    const confidence = VISION_CONFIDENCE_VALUES.has(rawConfidence) ? rawConfidence : 'low'
    return {
      estimated_kcal: kcal,
      estimated_protein_g: nonNegNumber(r.estimated_protein_g),
      estimated_carbs_g: nonNegNumber(r.estimated_carbs_g),
      estimated_fat_g: nonNegNumber(r.estimated_fat_g),
      confidence,
      items_guess: Array.isArray(r.items_guess) ? r.items_guess.map(String) : [],
      notes: String(r.notes ?? ''),
      swaps: Array.isArray(r.swaps) ? r.swaps.map(String) : [],
      narrative: r.narrative != null ? String(r.narrative) : undefined,
    }
  } catch {
    return null
  }
}

export async function callOpenAiChatCompletions(
  proxyBase: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; text: string }> {
  /** Same-origin proxy forwards this POST to `https://api.openai.com/v1/chat/completions`. */
  const url = proxyBase.replace(/\/$/, '') || '/api/openai'
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })
  const text = await r.text()
  return { ok: r.ok, status: r.status, text }
}

export function extractChatContent(responseText: string): string | null {
  try {
    const j = JSON.parse(responseText) as { choices?: { message?: { content?: string } }[] }
    const c = j.choices?.[0]?.message?.content
    return typeof c === 'string' ? c : null
  } catch {
    return null
  }
}
