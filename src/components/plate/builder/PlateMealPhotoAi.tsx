import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  HealthFocus,
  MealSlot,
} from '../../../domain/plateMeal'
import {
  buildVisionSystemPrompt,
  buildVisionUserText,
  callOpenAiChatCompletions,
  compressImageToJpegDataUrl,
  extractChatContent,
  parseMealVisionJson,
  type MealVisionEstimate,
} from '../../../domain/mealPhotoAi'
import { usePlateAiPrefsStore } from '../../../store/plateAiPrefsStore'
import { IconPhotoEstimate } from './PlateMealBuilder.icons'

type Props = {
  activeSlot: MealSlot
  healthFocus: HealthFocus
  phaseKcal: number | null
  targetProtein: number | null
  onAddCustomItem: (
    slot: MealSlot,
    custom: { label: string; kcal: number; p: number; f: number; c: number },
    portion?: number,
  ) => void
}

/**
 * Optional photo-estimate flow. Owns its own form/file/loading/error/result
 * state and the OpenAI prefs (key + proxy). Exposed as a `<details>` so the
 * builder isn't dominated by an experimental feature.
 */
export function PlateMealPhotoAi({
  activeSlot,
  healthFocus,
  phaseKcal,
  targetProtein,
  onAddCustomItem,
}: Props) {
  const openaiApiKey = usePlateAiPrefsStore((s) => s.openaiApiKey)
  const openaiProxyBase = usePlateAiPrefsStore((s) => s.openaiProxyBase)
  const setOpenaiApiKey = usePlateAiPrefsStore((s) => s.setOpenaiApiKey)
  const setOpenaiProxyBase = usePlateAiPrefsStore((s) => s.setOpenaiProxyBase)

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [result, setResult] = useState<MealVisionEstimate | null>(null)

  const setupDetailsRef = useRef<HTMLDetailsElement>(null)
  const [draftKey, setDraftKey] = useState('')
  const [draftProxy, setDraftProxy] = useState('')

  const hasKey = openaiApiKey.trim().length > 0

  const photoPreviewUrl = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : null),
    [photoFile],
  )

  useEffect(() => {
    if (!photoPreviewUrl) return
    return () => URL.revokeObjectURL(photoPreviewUrl)
  }, [photoPreviewUrl])

  const onSetupToggle = useCallback(
    (e: React.SyntheticEvent<HTMLDetailsElement>) => {
      if (e.currentTarget.open) {
        setDraftKey(openaiApiKey)
        setDraftProxy(openaiProxyBase)
      }
    },
    [openaiApiKey, openaiProxyBase],
  )

  const saveConnection = useCallback(() => {
    const k = draftKey.trim()
    if (!k) return
    setOpenaiApiKey(k)
    setOpenaiProxyBase(draftProxy)
    if (setupDetailsRef.current) setupDetailsRef.current.open = false
  }, [draftKey, draftProxy, setOpenaiApiKey, setOpenaiProxyBase])

  const analyzePhoto = useCallback(async () => {
    setErr(null)
    setResult(null)
    if (!photoFile) {
      setErr('Choose a photo first.')
      return
    }
    if (!openaiApiKey.trim()) {
      setErr(
        'Open “OpenAI connection (private)” below, paste your key, and save on this device.',
      )
      return
    }
    setLoading(true)
    try {
      const dataUrl = await compressImageToJpegDataUrl(photoFile, 1024)
      const body = {
        model: 'gpt-4o-mini',
        max_tokens: 900,
        messages: [
          { role: 'system', content: buildVisionSystemPrompt() },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: buildVisionUserText({
                  healthFocus,
                  phaseKcal,
                  targetProtein,
                }),
              },
              {
                type: 'image_url',
                image_url: { url: dataUrl, detail: 'low' },
              },
            ],
          },
        ],
      }
      const res = await callOpenAiChatCompletions(
        openaiProxyBase,
        openaiApiKey.trim(),
        body,
      )
      if (!res.ok) {
        setErr(res.text.slice(0, 400) || `Request failed (${res.status})`)
        return
      }
      const content = extractChatContent(res.text)
      if (!content) {
        setErr('Could not read model response.')
        return
      }
      const parsed = parseMealVisionJson(content)
      if (!parsed) {
        setErr('Model did not return valid JSON. Try again.')
        return
      }
      setResult(parsed)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [
    healthFocus,
    openaiApiKey,
    openaiProxyBase,
    phaseKcal,
    photoFile,
    targetProtein,
  ])

  const addAsCustom = useCallback(() => {
    if (!result) return
    onAddCustomItem(
      activeSlot,
      {
        label: 'Photo estimate (approx.)',
        kcal: Math.round(result.estimated_kcal),
        p: Math.round(result.estimated_protein_g * 10) / 10,
        f: Math.round(result.estimated_fat_g * 10) / 10,
        c: Math.round(result.estimated_carbs_g * 10) / 10,
      },
      1,
    )
  }, [activeSlot, onAddCustomItem, result])

  return (
    <details className="plate-meal-builder__ai">
      <summary className="plate-meal-builder__ai-summary">
        <span
          className="plate-meal-builder__panel-icon-slot plate-meal-builder__panel-icon-slot--ai"
          aria-hidden
        >
          <IconPhotoEstimate />
        </span>
        <span className="plate-meal-builder__ai-summary-text">
          <span className="plate-meal-builder__ai-summary-title">Photo estimate</span>
          <span className="plate-meal-builder__ai-summary-sub muted">
            Attach a photo · key stays in a private step
          </span>
        </span>
      </summary>
      <p className="muted plate-meal-builder__fine plate-meal-builder__fine--tight">
        Nothing is sent until you tap Analyze. Same-origin proxy details are in the README.
      </p>

      <div className="plate-meal-builder__ai-stack">
        <div className="plate-meal-builder__ai-photo-block">
          <label className="field plate-meal-builder__ai-photo-label">
            <span>Meal photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {photoFile && (
            <p className="plate-meal-builder__ai-photo-name muted">
              {photoFile.name}
            </p>
          )}
          {photoPreviewUrl && (
            <div className="plate-meal-builder__ai-photo-preview">
              <img
                alt=""
                src={photoPreviewUrl}
                className="plate-meal-builder__ai-photo-thumb"
              />
            </div>
          )}
        </div>

        <details
          ref={setupDetailsRef}
          className="plate-meal-builder__ai-setup"
          onToggle={onSetupToggle}
        >
          <summary className="plate-meal-builder__ai-setup-summary">
            <span className="plate-meal-builder__ai-setup-title">
              OpenAI connection (private)
            </span>
            <span className="plate-meal-builder__ai-setup-status muted">
              {hasKey
                ? 'Saved on this device only — expand to change'
                : 'Expand: paste key → save on this device'}
            </span>
          </summary>
          <div className="plate-meal-builder__ai-setup-body">
            <ol className="plate-meal-builder__ai-steps muted">
              <li>Optional: set the proxy base your app uses (default in README).</li>
              <li>Paste your API key. It is not shown when this section is closed.</li>
              <li>Save so it stays in this browser’s storage only.</li>
            </ol>
            <label className="field">
              <span>Proxy URL</span>
              <input
                value={draftProxy}
                onChange={(e) => setDraftProxy(e.target.value)}
                placeholder="/api/openai"
                autoComplete="off"
              />
            </label>
            <label className="field">
              <span>API key</span>
              <input
                type="password"
                autoComplete="off"
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                placeholder="sk-…"
              />
            </label>
            <div className="plate-meal-builder__ai-setup-actions">
              <button
                type="button"
                className="btn"
                disabled={!draftKey.trim()}
                onClick={saveConnection}
              >
                Save on this device
              </button>
            </div>
          </div>
        </details>
      </div>

      <div className="plate-meal-builder__ai-actions">
        <button
          type="button"
          className="btn"
          disabled={loading || !hasKey}
          title={
            hasKey
              ? undefined
              : 'Complete the OpenAI connection step and save your key first.'
          }
          onClick={() => void analyzePhoto()}
        >
          {loading ? 'Analyzing…' : 'Analyze photo'}
        </button>
        {result && (
          <button type="button" className="btn btn-ghost" onClick={addAsCustom}>
            Add estimate to wedge
          </button>
        )}
      </div>
      {err && (
        <div className="plate-meal-builder__vision-err-block">
          <p className="plate-meal-builder__err">{err}</p>
          {/fetch|network|failed to load|404|502|503|405/i.test(err) && (
            <p className="muted plate-meal-builder__fine">
              Same-origin{' '}
              <code className="plate-meal-builder__code">/api/openai</code>{' '}
              proxy must be running (see README).
            </p>
          )}
          <button
            type="button"
            className="btn btn-ghost plate-meal-builder__btn-sm"
            disabled={loading}
            onClick={() => void analyzePhoto()}
          >
            Try again
          </button>
        </div>
      )}
      {result && (
        <div className="plate-meal-builder__vision">
          <p>
            <strong>~{Math.round(result.estimated_kcal)} kcal</strong> · P{' '}
            {Math.round(result.estimated_protein_g * 10) / 10} · F{' '}
            {Math.round(result.estimated_fat_g * 10) / 10} · C{' '}
            {Math.round(result.estimated_carbs_g * 10) / 10} · confidence:{' '}
            {result.confidence}
          </p>
          {result.narrative && <p className="muted">{result.narrative}</p>}
          {result.items_guess.length > 0 && (
            <p className="plate-meal-builder__fine">
              <strong>Guessed items:</strong> {result.items_guess.join('; ')}
            </p>
          )}
          {result.swaps.length > 0 && (
            <p className="plate-meal-builder__fine">
              <strong>Swaps:</strong> {result.swaps.join(' · ')}
            </p>
          )}
          {result.notes && (
            <p className="plate-meal-builder__fine muted">{result.notes}</p>
          )}
        </div>
      )}
    </details>
  )
}
