type Props = {
  showCollapsibleHint: boolean
  onDismissHint: () => void
  savedMealBanner: string | null
  addedLineBanner: string | null
  saveStateLabel: string
  saveStateTone: 'saved' | 'unsaved' | 'idle'
  completion: {
    template: boolean
    wedge: boolean
    lines: boolean
  }
  showTour: boolean
  tourStep: number
  onTourNext: () => void
  onTourDismiss: () => void
}

/**
 * Card header for the meal builder: eyebrow, title, lead, plus the transient
 * banners (collapsible-panel hint, template-switch notice, save-to-today
 * confirmation). All banners are non-blocking and auto-dismiss; the only
 * interactive element is the hint's "OK".
 */
export function PlateMealBuilderIntro({
  showCollapsibleHint,
  onDismissHint,
  savedMealBanner,
  addedLineBanner,
  saveStateLabel,
  saveStateTone,
  completion,
  showTour,
  tourStep,
  onTourNext,
  onTourDismiss,
}: Props) {
  const tourSteps = [
    'Step 1: Pick a template to shape your plate.',
    'Step 2: Tap a wedge to choose where meal lines go.',
    'Step 3: Add meal lines, review totals, then save to today.',
  ]

  return (
    <div className="plate-meal-builder__intro">
      <header className="plate-meal-builder__head">
        <div className="eyebrow">Meal</div>
        <div className="plate-meal-builder__head-row">
          <h2 className="section-h section-h--flush">Your plate</h2>
          <span
            className={`plate-meal-builder__save-state plate-meal-builder__save-state--${saveStateTone}`}
            role="status"
          >
            {saveStateLabel}
          </span>
        </div>
        <p className="plate-meal-builder__lead muted">
          Pick a template, choose wedges on the plate, then add lines. Totals are for this meal only.
        </p>
        <ol className="plate-meal-builder__steps" aria-label="Plate builder steps">
          <li className={completion.template ? 'is-done' : ''}>
            <strong>1.</strong> Pick a template
          </li>
          <li className={completion.wedge ? 'is-done' : ''}>
            <strong>2.</strong> Choose a wedge
          </li>
          <li className={completion.lines ? 'is-done' : ''}>
            <strong>3.</strong> Add meal lines and save
          </li>
        </ol>
      </header>

      {showTour && (
        <div className="plate-meal-builder__tour" role="status">
          <p>{tourSteps[tourStep] ?? tourSteps[0]}</p>
          <div className="plate-meal-builder__tour-actions">
            {tourStep < tourSteps.length - 1 ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={onTourNext}>
                Next tip
              </button>
            ) : (
              <button type="button" className="btn btn-ghost btn-sm" onClick={onTourDismiss}>
                Got it
              </button>
            )}
          </div>
        </div>
      )}

      {showCollapsibleHint && (
        <div className="plate-meal-builder__hint-banner" role="status">
          <p>
            <strong>Tip:</strong> Foods and Custom start closed — open a panel to search or add a custom line.
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onDismissHint}
          >
            OK
          </button>
        </div>
      )}

      {savedMealBanner && (
        <p
          className="plate-meal-builder__notice plate-meal-builder__notice--saved"
          role="status"
          data-testid="meal-saved-banner"
        >
          {savedMealBanner}
        </p>
      )}

      {addedLineBanner && (
        <p className="plate-meal-builder__notice plate-meal-builder__notice--added" role="status">
          {addedLineBanner}
        </p>
      )}
    </div>
  )
}
