import { useCallback, useEffect, useRef, useState } from 'react'
import type { HealthFocus } from '../../../domain/plateMeal'
import {
  PLATE_BUILDER_FOCUS_META,
  PLATE_BUILDER_FOCUS_OPTIONS,
  healthFocusTheme,
} from '../../../data/plateContent'

type Totals = { kcal: number; p: number; f: number; c: number }

type Props = {
  totals: Totals
  phaseKcal: number | null
  phaseKcalNote: string
  targetProtein: number | null
  healthFocus: HealthFocus
  onFocusChange: (next: HealthFocus) => void
  focusLines: readonly string[]
}

/**
 * Totals band: kcal/macro chips, the floating "Lens" picker, and the
 * focus-specific narrative lines. Owns its own picker open/closed state and
 * outside-click / Escape handling so the parent can stay flat.
 */
export function PlateMealTotals({
  totals,
  phaseKcal,
  phaseKcalNote,
  targetProtein,
  healthFocus,
  onFocusChange,
  focusLines,
}: Props) {
  const focusTheme = healthFocusTheme(healthFocus)
  const [focusPickerOpen, setFocusPickerOpen] = useState(false)
  const focusSectionRef = useRef<HTMLDivElement>(null)

  const handleFocusPick = useCallback(
    (id: HealthFocus) => {
      onFocusChange(id)
      setFocusPickerOpen(false)
    },
    [onFocusChange],
  )

  useEffect(() => {
    if (!focusPickerOpen) return
    const onDocMouseDown = (e: MouseEvent) => {
      const root = focusSectionRef.current
      if (root && !root.contains(e.target as Node)) setFocusPickerOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [focusPickerOpen])

  useEffect(() => {
    if (!focusPickerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusPickerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusPickerOpen])

  const meta = PLATE_BUILDER_FOCUS_META[healthFocus]

  return (
    <div
      className="plate-meal-builder__tools-band plate-meal-builder__tools-band--totals"
      data-focus-theme={focusTheme}
    >
      <div className="plate-meal-builder__totals">
        <div className="plate-meal-builder__totals-head">
          <h4 className="plate-meal-builder__tools-section-title">Totals</h4>
          <div
            ref={focusSectionRef}
            className="plate-meal-builder__focus plate-meal-builder__focus--minimal"
            data-focus-theme={focusTheme}
          >
            <button
              type="button"
              className={`plate-meal-builder__focus-toggle plate-meal-builder__focus-toggle--minimal${focusPickerOpen ? ' is-open' : ''}`}
              aria-expanded={focusPickerOpen}
              aria-controls="plate-meal-builder-focus-panel"
              aria-label={`Totals lens: ${meta.label}. ${focusPickerOpen ? 'Close options' : 'Change how totals are read'}`}
              title={meta.hint}
              onClick={() => setFocusPickerOpen((o) => !o)}
            >
              <span className="plate-meal-builder__focus-toggle-min-label">Lens</span>
              <span className="plate-meal-builder__focus-toggle-min-value">
                {meta.label}
              </span>
              <span
                className="plate-meal-builder__focus-toggle-chevron"
                aria-hidden
              />
            </button>
            <div
              id="plate-meal-builder-focus-panel"
              className="plate-meal-builder__focus-panel plate-meal-builder__focus-panel--floating"
              hidden={!focusPickerOpen}
            >
              <div
                className="plate-meal-builder__focus-grid plate-meal-builder__focus-grid--compact"
                role="radiogroup"
                aria-label="Totals lens options"
              >
                {PLATE_BUILDER_FOCUS_OPTIONS.map((opt) => {
                  const active = healthFocus === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`plate-meal-builder__focus-option plate-meal-builder__focus-option--compact${active ? ' is-active' : ''}`}
                      onClick={() => handleFocusPick(opt.id)}
                    >
                      <span className="plate-meal-builder__focus-option-title">
                        {opt.label}
                      </span>
                      <span className="plate-meal-builder__focus-option-hint">
                        {opt.hint}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <p className="plate-meal-builder__totals-lens muted">{meta.totalsEyebrow}</p>
        <div className="plate-meal-builder__chips">
          <span className="chip teal" data-testid="meal-total-kcal">
            {totals.kcal} kcal
          </span>
          <span className="chip clay" data-testid="meal-total-macros">
            P {Math.round(totals.p * 10) / 10} · F{' '}
            {Math.round(totals.f * 10) / 10} · C{' '}
            {Math.round(totals.c * 10) / 10}
          </span>
          {phaseKcal != null && (
            <span className="chip gold">
              Phase ~{phaseKcal} kcal ({phaseKcalNote})
            </span>
          )}
          {targetProtein != null && (
            <span className="chip teal">~{targetProtein} g protein/day</span>
          )}
        </div>
        <ul className="plate-meal-builder__focus-lines">
          {focusLines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
