import { useCallback, useId, useState } from 'react'
import {
  type MealLineItem,
  type MealSlot,
  type MealTemplate,
  scaledFoodQtyLabel,
  slotLabel,
} from '../../../domain/plateMeal'
import { FoodTypeIcon, foodTypeKind } from '../FoodTypeIcon'
import { IconRemoveLine } from './PlateMealBuilder.icons'

type Props = {
  template: MealTemplate
  activeSlot: MealSlot
  items: MealLineItem[]
  onSetPortion: (id: string, raw: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onResetAll: () => void
  onSaveToToday: () => void
}

/**
 * Meal lines worksheet: full band with Save/Clear/Reset and list, or fully hidden
 * behind a quiet strip to reopen. Per-line fold is separate local state.
 */
export function PlateMealLines({
  template,
  activeSlot,
  items,
  onSetPortion,
  onRemove,
  onClear,
  onResetAll,
  onSaveToToday,
}: Props) {
  const worksheetPanelId = useId()

  /** Whole worksheet hidden (incl. actions); only a faint reopen strip stays. */
  const [worksheetCollapsed, setWorksheetCollapsed] = useState(false)

  /** Fold portion + remove to keep the list scannable; lines stay expanded by default. */
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set())

  const toggle = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Stale entries in `collapsedIds` for removed items are harmless: render
  // only checks `has(it.id)` against current items, and item ids are unique
  // (uuid-style), so the set never needs explicit cleanup.

  const reopenAriaLabel =
    items.length === 0
      ? 'Open meal lines — no lines yet; add foods or custom lines, save, or clear.'
      : `Open meal lines — ${items.length} line${items.length === 1 ? '' : 's'}; edit portions, save to today, or clear.`

  return (
    <div
      className={`plate-meal-builder__tools-band plate-meal-builder__tools-band--lines${worksheetCollapsed ? ' is-worksheet-collapsed' : ''}`}
    >
      {worksheetCollapsed ? (
        <button
          type="button"
          className="plate-meal-builder__lines-worksheet-gentle-open"
          data-testid="meal-lines-show-worksheet"
          aria-expanded="false"
          aria-controls={worksheetPanelId}
          aria-label={reopenAriaLabel}
          onClick={() => setWorksheetCollapsed(false)}
        >
          <span className="plate-meal-builder__lines-worksheet-gentle-open-label">
            <span className="plate-meal-builder__lines-worksheet-gentle-open-meal">Meal</span>
            <span className="plate-meal-builder__lines-worksheet-gentle-open-lines"> lines</span>
          </span>
        </button>
      ) : null}

      <div
        id={worksheetPanelId}
        role="region"
        aria-label="Meal lines worksheet"
        hidden={worksheetCollapsed}
        className="plate-meal-builder__lines"
      >
        <div className="plate-meal-builder__lines-head">
          <div className="plate-meal-builder__lines-title-block">
            <h4 className="plate-meal-builder__tools-section-title">Meal lines</h4>
            <p className="plate-meal-builder__lines-sub muted">
              Sliders apply to this meal only. Tap a row to fold portion and remove.{' '}
              <strong className="plate-meal-builder__lines-sub-strong">Close</strong> hides this
              section; your lines stay until you clear or reset. When closed, look for the teal
              Meal lines strip — tap it to edit or save.
            </p>
          </div>
          <div className="plate-meal-builder__lines-actions">
            <button
              type="button"
              className="btn"
              data-testid="meal-save-to-today"
              disabled={items.length === 0}
              title={
                items.length === 0
                  ? 'Add at least one line before saving'
                  : "Save this meal to today's log"
              }
              onClick={onSaveToToday}
            >
              Save to today
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClear}>
              Clear
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="meal-reset-all"
              onClick={onResetAll}
            >
              Reset all
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="meal-lines-hide-worksheet"
              aria-expanded="true"
              aria-controls={worksheetPanelId}
              title="Close meal lines (lines and portions stay until you clear or reset)"
              onClick={() => setWorksheetCollapsed(true)}
            >
              Close
            </button>
          </div>
        </div>

        <div className="plate-meal-builder__lines-worksheet-panel">
          {items.length === 0 ? (
            <p className="muted">Empty.</p>
          ) : (
            <ul className="plate-meal-builder__line-list">
            {items.map((it) => {
              const slot = it.slot
              const label =
                it.source === 'food' && it.foodSnapshot
                  ? it.foodSnapshot.n
                  : (it.custom?.label ?? '—')
              const m =
                it.source === 'food' && it.foodSnapshot
                  ? it.foodSnapshot
                  : it.custom
              const baseK = m?.kcal ?? 0
              const scaled = Math.round(baseK * it.portion)
              const portionId = `portion-${it.id}`
              const panelId = `meal-line-panel-${it.id}`
              const headerId = `meal-line-head-${it.id}`
              const meta =
                it.source === 'food' && it.foodSnapshot
                  ? `${scaledFoodQtyLabel(it.foodSnapshot.qty, it.portion)} · ${scaled} kcal`
                  : `custom · ${scaled} kcal`
              const lineCollapsed = collapsedIds.has(it.id)
              const slotText = slotLabel(template, slot)
              const lineKind =
                it.source === 'food' && it.foodSnapshot
                  ? foodTypeKind(it.foodSnapshot.t)
                  : null
              const wedgeActive = it.slot === activeSlot
              return (
                <li
                  key={it.id}
                  className={`plate-meal-builder__line${lineCollapsed ? ' is-collapsed' : ''}`}
                  data-wedge-active={wedgeActive ? '1' : undefined}
                >
                  <div className="plate-meal-builder__line-inner">
                    <button
                      type="button"
                      id={headerId}
                      className="plate-meal-builder__line-header"
                      aria-expanded={!lineCollapsed}
                      aria-controls={panelId}
                      aria-label={
                        lineCollapsed
                          ? `Show portion and remove for ${label} (${slotText})`
                          : `Hide portion and remove for ${label} (${slotText})`
                      }
                      onClick={() => toggle(it.id)}
                    >
                      <div className="plate-meal-builder__line-identity">
                        <span
                          className="pill pill--teal plate-meal-builder__line-slot"
                          aria-hidden
                        >
                          {slotText}
                        </span>
                        <div className="plate-meal-builder__line-copy">
                          <strong className="plate-meal-builder__line-name">
                            {lineKind ? (
                              <FoodTypeIcon
                                kind={lineKind}
                                size="sm"
                                className="plate-meal-builder__line-name-icon"
                                labelled={false}
                              />
                            ) : null}
                            {label}
                          </strong>
                          <span className="plate-meal-builder__line-meta muted">
                            {meta}
                          </span>
                        </div>
                      </div>
                      <span
                        className="plate-meal-builder__line-header-trail"
                        aria-hidden
                      >
                        {lineCollapsed ? (
                          <span className="plate-meal-builder__line-portion-hint">
                            {it.portion.toFixed(1)}×
                          </span>
                        ) : null}
                        <span
                          className={`plate-meal-builder__line-chevron${!lineCollapsed ? ' is-open' : ''}`}
                        />
                      </span>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      hidden={lineCollapsed}
                      className="plate-meal-builder__line-body"
                    >
                      <div className="plate-meal-builder__line-edit">
                        <div className="plate-meal-builder__portion-field">
                          <input
                            id={portionId}
                            type="range"
                            className="plate-meal-builder__portion-slider"
                            min={0.1}
                            max={10}
                            step={0.1}
                            value={it.portion}
                            onChange={(e) => onSetPortion(it.id, e.currentTarget.value)}
                            aria-label={`Portion for ${label}`}
                            aria-valuetext={`${it.portion.toFixed(1)} times reference amount`}
                          />
                          <span
                            className="plate-meal-builder__portion-readout"
                            aria-hidden
                          >
                            {it.portion.toFixed(1)}×
                          </span>
                        </div>
                        <button
                          type="button"
                          className="plate-meal-builder__line-remove"
                          onClick={() => onRemove(it.id)}
                          aria-label={`Remove ${label}`}
                          title="Remove line"
                        >
                          <IconRemoveLine />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
