import type { MealTemplate } from '../../../domain/plateMeal'

const TEMPLATE_CHOICES: readonly { id: MealTemplate; label: string }[] = [
  { id: 'rest', label: 'Rest day' },
  { id: 'training', label: 'Training day' },
  { id: 'soup', label: 'Soup bowl' },
]

type Props = {
  template: MealTemplate
  onPick: (next: MealTemplate) => void
}

/** Segmented control for switching between rest / training / soup templates. */
export function PlateTemplatePicker({ template, onPick }: Props) {
  return (
    <div className="plate-meal-builder__toolbar">
      <div className="plate-meal-builder__templates">
        <span className="plate-meal-builder__label">Template</span>
        <div className="plate-meal-builder__seg">
          {TEMPLATE_CHOICES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`plate-meal-builder__seg-btn${template === id ? ' is-active' : ''}`}
              onClick={() => onPick(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
