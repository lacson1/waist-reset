import type { MealSlot } from '../../../domain/plateMeal'

type Props = {
  activeWedgeLabel: string
  activeSlot: MealSlot
}

/** Compact "Active wedge" pill shown alongside the template chips. */
export function PlateWedgeContext({ activeWedgeLabel, activeSlot }: Props) {
  return (
    <div className="plate-meal-builder__context" aria-live="polite">
      <span className="plate-meal-builder__context-label">Active wedge</span>
      <span className="plate-meal-builder__context-wedge" data-slot={activeSlot}>
        {activeWedgeLabel}
      </span>
    </div>
  )
}
