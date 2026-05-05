import { useMemo } from 'react'
import {
  type MealLineItem,
  type MealSlot,
  type MealTemplate,
  type PlatePickLine,
  slotPickLinesForTemplate,
} from '../../../domain/plateMeal'
import {
  PLATE_BUILDER_GUIDE,
  PLATE_BUILDER_GUIDE_FOOTER,
} from '../../../data/plateContent'
import { RestDayPlateSvg, type RestDaySlot } from '../RestDayPlateSvg'
import { TrainingDayPlateSvg, type TrainingDaySlot } from '../TrainingDayPlateSvg'
import { SoupBowlSvg, type SoupBowlSlot } from '../SoupBowlSvg'

type Props = {
  template: MealTemplate
  activeSlot: MealSlot
  items: MealLineItem[]
  onSelectSlot: (slot: MealSlot) => void
}

/**
 * Plate diagram + wedge guide. The SVG is interactive (tap a wedge) and
 * the right-hand guide list mirrors the same selection. Both call the
 * same `onSelectSlot` for symmetry.
 */
export function PlateVisual({ template, activeSlot, items, onSelectSlot }: Props) {
  const slotPicks = useMemo(
    () => slotPickLinesForTemplate(template, items),
    [template, items],
  )

  const graphic = (() => {
    if (template === 'rest') {
      return (
        <RestDayPlateSvg
          interactive
          activeSlot={activeSlot as RestDaySlot}
          onSlotSelect={(s) => onSelectSlot(s)}
          slotPicks={
            slotPicks as Partial<Record<RestDaySlot, readonly PlatePickLine[]>>
          }
        />
      )
    }
    if (template === 'training') {
      return (
        <TrainingDayPlateSvg
          interactive
          activeSlot={activeSlot as TrainingDaySlot}
          onSlotSelect={(s) => onSelectSlot(s)}
          slotPicks={
            slotPicks as Partial<
              Record<TrainingDaySlot, readonly PlatePickLine[]>
            >
          }
        />
      )
    }
    return (
      <SoupBowlSvg
        interactive
        activeSlot={activeSlot as SoupBowlSlot}
        onSlotSelect={(s) => onSelectSlot(s)}
        slotPicks={
          slotPicks as Partial<Record<SoupBowlSlot, readonly PlatePickLine[]>>
        }
      />
    )
  })()

  const footer = PLATE_BUILDER_GUIDE_FOOTER[template]

  return (
    <>
      <h3
        className="plate-meal-builder__block-title"
        id="plate-builder-plate-heading"
      >
        Plate and wedges
      </h3>
      <div
        className="plate-meal-builder__plate-visual"
        aria-labelledby="plate-builder-plate-heading"
      >
        <div className="plate-meal-builder__plate-media">
          <div className="plate-meal-builder__svg-frame">{graphic}</div>
        </div>
        <div
          className="plate-meal-builder__guide"
          role="region"
          aria-label="Wedge guide"
        >
          <span className="plate-meal-builder__label">Guide</span>
          <p className="plate-meal-builder__guide-kicker muted">Row = wedge.</p>
          <div className="plate-meal-builder__guide-list">
            {PLATE_BUILDER_GUIDE[template].map((row) => {
              const selected = activeSlot === row.slot
              return (
                <button
                  key={row.slot}
                  type="button"
                  className={`plate-meal-builder__guide-line${selected ? ' is-active' : ''}`}
                  data-slot={row.slot}
                  aria-label={
                    selected
                      ? `${row.title}, selected`
                      : `${row.title}, select wedge`
                  }
                  onClick={() => onSelectSlot(row.slot)}
                >
                  <strong>{row.title}</strong>
                  <span className="muted plate-meal-builder__guide-detail">
                    {row.detail}
                  </span>
                </button>
              )
            })}
          </div>
          {footer != null && (
            <p className="plate-meal-builder__guide-drizzle muted">{footer}</p>
          )}
        </div>
      </div>
    </>
  )
}
