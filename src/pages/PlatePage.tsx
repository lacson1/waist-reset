import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProgressStore } from '../store/progressStore'
import { usePlateBuilderStore } from '../store/plateBuilderStore'
import { computePersonal, phaseKcal, phaseKcalNote, currentPhase } from '../domain/personalisation'
import type { MealTemplate } from '../domain/plateMeal'
import type { PlateScenarioPreset, PlateSwapRow } from '../data/plateContent'
import { PLATE_SCENARIOS, PLATE_SWAP_SECTIONS } from '../data/plateContent'
import { buildSwapCustomLine } from '../domain/plateSwapApply'
import { PlateMealBuilder } from '../components/plate/PlateMealBuilder'
import { PlateConfirmDialog } from '../components/plate/builder/PlateConfirmDialog'

const MEAL_TEMPLATES: MealTemplate[] = ['rest', 'training', 'soup']

function mealTemplateFromQuery(raw: string | null): MealTemplate | null {
  if (raw == null || raw === '') return null
  return MEAL_TEMPLATES.includes(raw as MealTemplate) ? (raw as MealTemplate) : null
}

function scrollPlateBuilderIntoView() {
  document
    .querySelector('[data-testid="plate-meal-builder"]')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function PlatePage() {
  const baseline = useProgressStore((s) => s.baseline)
  const phase = currentPhase(baseline)
  const personal = computePersonal(baseline)
  const kcal = phaseKcal(phase, baseline)
  const kcalNote = phaseKcalNote(phase)
  const [searchParams, setSearchParams] = useSearchParams()
  const setTemplate = usePlateBuilderStore((s) => s.setTemplate)
  const plateTemplate = usePlateBuilderStore((s) => s.template)
  const plateItemCount = usePlateBuilderStore((s) => s.items.length)
  const setActiveSlot = usePlateBuilderStore((s) => s.setActiveSlot)
  const addCustomItem = usePlateBuilderStore((s) => s.addCustomItem)
  const applyPlatePreset = usePlateBuilderStore((s) => s.applyPlatePreset)

  const [presetDialog, setPresetDialog] = useState<PlateScenarioPreset | null>(null)

  const runApplyPreset = useCallback(
    (preset: PlateScenarioPreset) => {
      applyPlatePreset({ template: preset.template, lines: preset.lines })
      setPresetDialog(null)
      queueMicrotask(() => scrollPlateBuilderIntoView())
    },
    [applyPlatePreset],
  )

  const requestScenarioPreset = useCallback(
    (preset: PlateScenarioPreset | undefined) => {
      if (!preset) return
      if (plateItemCount > 0) {
        setPresetDialog(preset)
        return
      }
      runApplyPreset(preset)
    },
    [plateItemCount, runApplyPreset],
  )

  const appendSwapVariant = useCallback(
    (row: PlateSwapRow, variant: 'western' | 'african') => {
      const built = buildSwapCustomLine(row, variant, plateTemplate)
      if (!built) return
      setActiveSlot(built.slot)
      addCustomItem(built.slot, {
        label: built.label,
        kcal: built.kcal,
        p: built.p,
        f: built.f,
        c: built.c,
      })
      queueMicrotask(() => scrollPlateBuilderIntoView())
    },
    [addCustomItem, plateTemplate, setActiveSlot],
  )

  useEffect(() => {
    const t = mealTemplateFromQuery(searchParams.get('template'))
    if (t == null) return
    setTemplate(t)
    const next = new URLSearchParams(searchParams)
    next.delete('template')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams, setTemplate])

  return (
    <section className="view active plate-page">
      <div className="topbar plate-page-topbar">
        <div className="topbar-left">
          <div className="eyebrow">Plate</div>
          <h1>Build the plate, not the calorie count.</h1>
          <div className="topbar-sub">
            Chips from <Link to="/progress">My Progress</Link>. <Link to="/numbers">Your Numbers</Link> for
            Mifflin–St Jeor. <Link to="/daily">Daily plan</Link> for example meal timing and kcal blocks.
          </div>
        </div>
        {kcal != null && (
          <div className="topbar-right">
            <span className="chip teal">{kcal} kcal</span>
            <span className="chip gold">{kcalNote}</span>
            {personal.protein != null && (
              <span className="chip clay">~{personal.protein} g protein</span>
            )}
          </div>
        )}
      </div>

      <PlateMealBuilder
        phaseKcal={kcal}
        phaseKcalNote={kcalNote}
        targetProtein={personal.protein}
        baseline={baseline}
      />

      <details className="plate-page-reference">
        <summary className="plate-page-reference__summary">
          <span className="plate-page-reference__summary-title">Swaps & scenarios</span>
          <span className="plate-page-reference__summary-hint muted">Optional.</span>
        </summary>

        <div className="card plate-swaps-card plate-page-reference__card">
          <header className="plate-swaps-card__head">
            <h2 className="section-h section-h--flush">African ↔ Western</h2>
            <p className="plate-lead">
              More ideas: <Link to="/swaps">Food Swaps</Link>.
            </p>
          </header>

          <div className="plate-swap-sections">
            {PLATE_SWAP_SECTIONS.map((section) => (
              <section
                key={section.id}
                className={`plate-swap-group plate-swap-group--accent-${section.accent}`}
                aria-labelledby={`plate-swap-h-${section.id}`}
              >
                <header className="plate-swap-group__head">
                  <h3 className="plate-swap-group__title" id={`plate-swap-h-${section.id}`}>
                    {section.title}
                  </h3>
                  <p className="plate-swap-group__lead">{section.lead}</p>
                </header>
                <div className="plate-swap-grid">
                  {section.rows.map((row) => (
                    <article
                      key={`${section.id}-${row.slot}`}
                      className={`plate-swap-tile plate-swap-tile--accent-${section.accent}`}
                    >
                      <div className="plate-swap-tile__slot">{row.slot}</div>
                      <div className="plate-swap-tile__pair">
                        <div className="plate-swap-tile__half plate-swap-tile__half--western">
                          <span className="plate-swap-tile__label">Western</span>
                          <p className="plate-swap-tile__value">{row.western}</p>
                        </div>
                        <div className="plate-swap-tile__bridge" aria-hidden>
                          <span className="plate-swap-tile__bridge-line" />
                          <span className="plate-swap-tile__bridge-icon">↔</span>
                          <span className="plate-swap-tile__bridge-line" />
                        </div>
                        <div className="plate-swap-tile__half plate-swap-tile__half--african">
                          <span className="plate-swap-tile__label">African</span>
                          <p className="plate-swap-tile__value">{row.african}</p>
                        </div>
                      </div>
                      <div className="plate-swap-tile__why">
                        <span className="plate-swap-tile__why-kicker">Same role</span>
                        <span className="plate-swap-tile__why-text">{row.why}</span>
                      </div>
                      <div className="plate-swap-tile__actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm plate-swap-tile__action"
                          aria-label={`Add Western pick for ${row.slot} to the current plate`}
                          onClick={() => appendSwapVariant(row, 'western')}
                        >
                          Add Western
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm plate-swap-tile__action"
                          aria-label={`Add African pick for ${row.slot} to the current plate`}
                          onClick={() => appendSwapVariant(row, 'african')}
                        >
                          Add African
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="card plate-scenarios-card plate-page-reference__card">
          <h3>Scenarios</h3>
          <p className="plate-scenarios-card__hint muted">
            Load a full example: switches template (rest, training, or soup), fills each wedge with
            custom lines, and scrolls you back to the builder. Macros are illustrative — edit
            portions on the worksheet.
          </p>
          <div className="plate-scenarios-grid">
            {PLATE_SCENARIOS.map((s, i) => (
              <div key={s.title} className="plate-scenario-tile">
                <strong>{s.title}</strong>
                <span>{s.detail}</span>
                {s.platePreset != null ? (
                  <div className="plate-scenario-tile__actions">
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-testid={`plate-scenario-load-${i}`}
                      aria-label={`Load scenario ${s.title} onto the plate builder`}
                      onClick={() => requestScenarioPreset(s.platePreset)}
                    >
                      Load on plate
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </details>

      <PlateConfirmDialog
        open={presetDialog != null}
        titleId="plate-preset-dialog-title"
        title="Replace current meal lines?"
        body={
          <p>
            This scenario loads a <strong>template</strong> and <strong>example lines</strong> into
            the builder. Your current meal lines will be cleared. You can still undo by editing or
            clearing lines afterward.
          </p>
        }
        confirmLabel="Load scenario"
        confirmTestId="plate-preset-confirm"
        onCancel={() => setPresetDialog(null)}
        onConfirm={() => {
          if (presetDialog) runApplyPreset(presetDialog)
        }}
      />
    </section>
  )
}
