type Props = {
  showCollapsibleHint: boolean
  onDismissHint: () => void
  savedMealBanner: string | null
  addedLineBanner: string | null
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
}: Props) {
  return (
    <div className="plate-meal-builder__intro">
      <header className="plate-meal-builder__head">
        <div className="eyebrow">Meal</div>
        <h2 className="section-h section-h--flush">Your plate</h2>
        <p className="plate-meal-builder__lead muted">
          Pick a template, choose wedges on the plate, then add lines. Totals are for this meal only.
        </p>
      </header>

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
