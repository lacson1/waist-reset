import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { FoodRow } from '../../../domain/foods'
import {
  type MealSlot,
  type MealTemplate,
  slotLabel,
} from '../../../domain/plateMeal'
import { FoodSearchPanel } from '../FoodSearchPanel'
import {
  IconCustomPanel,
  IconDatabasePanel,
  IconMoreVertical,
} from './PlateMealBuilder.icons'

/** When the inputs band is narrower than this, the Foods panel head uses a ⋮ overflow control. */
const COMPACT_PX = 520

type CustomMacros = { label: string; kcal: number; p: number; f: number; c: number }

type Props = {
  template: MealTemplate
  activeSlot: MealSlot
  foods: FoodRow[] | null
  foodsLoading: boolean
  foodsErr: string | null
  reloadFoods: () => void
  onAddFood: (slot: MealSlot, food: FoodRow, portion?: number) => void
  onAddCustom: (slot: MealSlot, custom: CustomMacros, portion?: number) => void
}

/**
 * "Add to this meal" inputs band: one Foods section. Expanded, it shows the
 * database search and a custom-line form nested at the bottom. Narrow widths
 * hide the panel head and open the same panel from a ⋮ menu.
 */
export function PlateMealSources({
  template,
  activeSlot,
  foods,
  foodsLoading,
  foodsErr,
  reloadFoods,
  onAddFood,
  onAddCustom,
}: Props) {
  const [foodsOpen, setFoodsOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [overflowOpen, setOverflowOpen] = useState(false)

  const foodsSectionRef = useRef<HTMLElement | null>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const overflowRef = useRef<HTMLDivElement>(null)

  const [customLabel, setCustomLabel] = useState('')
  const [customKcal, setCustomKcal] = useState('')
  const [customP, setCustomP] = useState('')
  const [customF, setCustomF] = useState('')
  const [customC, setCustomC] = useState('')

  const activeWedgeLabel = useMemo(
    () => slotLabel(template, activeSlot),
    [template, activeSlot],
  )

  const foodsPanelTitle = useMemo(
    () =>
      `Search the food database, filter, and add portions to the active wedge (${activeWedgeLabel}). When expanded, a custom line form appears at the bottom.`,
    [activeWedgeLabel],
  )

  const foodsPanelAriaLabel = useMemo(
    () =>
      `Foods, ${foodsOpen ? 'expanded' : 'collapsed'}. ${foodsPanelTitle} Use the chevron to open or close.`,
    [foodsOpen, foodsPanelTitle],
  )

  const highCustomKcal = useMemo(() => {
    const k = Number(customKcal)
    return Number.isFinite(k) && k > 4000
  }, [customKcal])

  const addCustomFromForm = useCallback(() => {
    const kcal = Number(customKcal)
    const p = Number(customP)
    const f = Number(customF)
    const c = Number(customC)
    const label = customLabel.trim()
    if (!label || !Number.isFinite(kcal) || kcal < 0) return
    if (!Number.isFinite(p) || !Number.isFinite(f) || !Number.isFinite(c)) return
    if (kcal > 20000 || p > 500 || f > 500 || c > 2000) {
      if (!window.confirm('Macros look extreme for one line. Add anyway?')) return
    }
    onAddCustom(activeSlot, { label, kcal, p, f, c }, 1)
    setCustomLabel('')
    setCustomKcal('')
    setCustomP('')
    setCustomF('')
    setCustomC('')
  }, [activeSlot, customC, customF, customKcal, customLabel, customP, onAddCustom])

  /** Initial compact-mode probe before paint to avoid flicker. */
  useLayoutEffect(() => {
    const el = bandRef.current
    if (!el) return
    const isCompact = el.getBoundingClientRect().width < COMPACT_PX
    setCompact(isCompact)
    if (!isCompact) setOverflowOpen(false)
  }, [])

  /** Re-evaluate compact mode whenever the band resizes. */
  useEffect(() => {
    const el = bandRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.getBoundingClientRect().width
      const isCompact = w < COMPACT_PX
      setCompact(isCompact)
      if (!isCompact) setOverflowOpen(false)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!overflowOpen) return
    const onDocPointerDown = (e: PointerEvent) => {
      const root = overflowRef.current
      const t = e.target
      if (!root || !(t instanceof Node) || root.contains(t)) return
      setOverflowOpen(false)
    }
    document.addEventListener('pointerdown', onDocPointerDown, true)
    return () => document.removeEventListener('pointerdown', onDocPointerDown, true)
  }, [overflowOpen])

  useEffect(() => {
    if (!overflowOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverflowOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overflowOpen])

  useEffect(() => {
    if (!foodsOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const root = foodsSectionRef.current
      const t = e.target
      if (!root || !(t instanceof Node) || root.contains(t)) return
      const card = root.closest('.plate-meal-builder')
      if (card && card.contains(t)) return
      setFoodsOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [foodsOpen])

  useEffect(() => {
    if (!foodsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      setFoodsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [foodsOpen])

  const toggleFoodsFromOverflow = useCallback(() => {
    setFoodsOpen((wasOpen) => !wasOpen)
    setOverflowOpen(false)
  }, [])

  return (
    <div
      ref={bandRef}
      className={`plate-meal-builder__tools-band plate-meal-builder__tools-band--inputs${compact ? ' is-compact-meal-sources' : ''}`}
    >
      {compact && (
        <div ref={overflowRef} className="plate-meal-builder__source-overflow">
          <button
            type="button"
            className={`plate-meal-builder__source-overflow-trigger${overflowOpen ? ' is-open' : ''}`}
            aria-expanded={overflowOpen}
            aria-haspopup="menu"
            aria-controls="plate-meal-source-overflow-menu"
            data-testid="meal-source-overflow"
            title="Open foods"
            aria-label="Add to meal. Open foods search and custom line."
            onClick={() => setOverflowOpen((o) => !o)}
          >
            <IconMoreVertical />
          </button>
          {overflowOpen && (
            <div
              id="plate-meal-source-overflow-menu"
              role="menu"
              aria-label="Add to this meal"
              className="plate-meal-builder__source-overflow-menu"
            >
              <button
                type="button"
                role="menuitem"
                className={`plate-meal-builder__source-overflow-item${foodsOpen ? ' is-active' : ''}`}
                data-testid="meal-source-overflow-foods"
                onClick={toggleFoodsFromOverflow}
              >
                <span
                  className="plate-meal-builder__source-overflow-item-icon plate-meal-builder__source-overflow-item-icon--database"
                  aria-hidden
                >
                  <IconDatabasePanel />
                </span>
                <span className="plate-meal-builder__source-overflow-item-text">
                  <span className="plate-meal-builder__source-overflow-item-title">
                    Foods
                  </span>
                  <span className="plate-meal-builder__source-overflow-item-hint muted">
                    Search, filters, and custom line
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>
      )}
      <div className="plate-meal-builder__panels" role="region" aria-label="Add to this meal">
        <section
          ref={foodsSectionRef}
          className="plate-meal-builder__panel"
          data-testid="meal-db-panel"
        >
          <button
            type="button"
            className={`plate-meal-builder__panel-head plate-meal-builder__panel-head--tools${foodsOpen ? ' is-open' : ''}`}
            aria-expanded={foodsOpen ? 'true' : 'false'}
            aria-controls="meal-db-panel-body"
            id="meal-db-panel-toggle"
            data-testid="meal-db-toggle"
            title={foodsPanelTitle}
            aria-label={foodsPanelAriaLabel}
            onClick={() => setFoodsOpen((o) => !o)}
          >
            <span
              className="plate-meal-builder__panel-icon-slot plate-meal-builder__panel-icon-slot--database"
              aria-hidden
            >
              <IconDatabasePanel />
            </span>
            <span className="plate-meal-builder__panel-title">Foods</span>
            <span className="plate-meal-builder__panel-chevron" aria-hidden />
          </button>
          {foodsOpen && (
            <div
              className="plate-meal-builder__panel-body"
              id="meal-db-panel-body"
              role="region"
              aria-labelledby="meal-db-panel-toggle"
            >
              <FoodSearchPanel
                foods={foods ?? []}
                loading={foodsLoading}
                err={foodsErr}
                reload={reloadFoods}
                template={template}
                activeSlot={activeSlot}
                onAdd={(f) => onAddFood(activeSlot, f, 1)}
              />
              <div
                className="plate-meal-builder__nested-custom"
                role="group"
                aria-labelledby="meal-nested-custom-title"
              >
                <div className="plate-meal-builder__nested-custom-head">
                  <span className="plate-meal-builder__nested-custom-icon" aria-hidden>
                    <IconCustomPanel />
                  </span>
                  <div className="plate-meal-builder__nested-custom-head-text">
                    <h4 className="plate-meal-builder__nested-custom-title" id="meal-nested-custom-title">
                      Custom line
                    </h4>
                    <p className="plate-meal-builder__nested-custom-sub muted">
                      Hand-entered label and macros for {activeWedgeLabel}.
                    </p>
                  </div>
                </div>
                <div className="plate-meal-builder__custom-grid">
                  <label className="field">
                    <span>Label</span>
                    <input
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="e.g. Palm oil drizzle"
                      data-testid="meal-custom-label"
                    />
                  </label>
                  <label className="field">
                    <span>Kcal</span>
                    <input
                      value={customKcal}
                      onChange={(e) => setCustomKcal(e.target.value)}
                      inputMode="decimal"
                      data-testid="meal-custom-kcal"
                    />
                  </label>
                  <label className="field">
                    <span>P (g)</span>
                    <input
                      value={customP}
                      onChange={(e) => setCustomP(e.target.value)}
                      inputMode="decimal"
                    />
                  </label>
                  <label className="field">
                    <span>F (g)</span>
                    <input
                      value={customF}
                      onChange={(e) => setCustomF(e.target.value)}
                      inputMode="decimal"
                    />
                  </label>
                  <label className="field">
                    <span>C (g)</span>
                    <input
                      value={customC}
                      onChange={(e) => setCustomC(e.target.value)}
                      inputMode="decimal"
                    />
                  </label>
                </div>
                {highCustomKcal && (
                  <p className="plate-meal-builder__warn" role="note">
                    Very high kcal for one line — double-check before adding.
                  </p>
                )}
                <button
                  type="button"
                  className="btn"
                  onClick={addCustomFromForm}
                  data-testid="meal-add-custom"
                >
                  Add custom line
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
