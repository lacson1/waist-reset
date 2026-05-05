import type { MealSlot } from '../../../domain/plateMeal'

type Props = {
  activeWedgeLabel: string
  activeSlot: MealSlot
}

/** Read-only "Active wedge" callout shown above the plate visual. */
export function PlateWedgeContext({ activeWedgeLabel, activeSlot }: Props) {
  return (
    <div className="plate-meal-builder__context" aria-live="polite">
      <div className="plate-meal-builder__context-main">
        <span className="plate-meal-builder__context-label">Active wedge</span>
        <span className="plate-meal-builder__context-wedge" data-slot={activeSlot}>
          {activeWedgeLabel}
        </span>
      </div>
      <p className="plate-meal-builder__context-hint muted">
        Tap the diagram or a guide row to change wedge. Food lines attach here.
      </p>
    </div>
  )
}
