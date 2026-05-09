type Props = {
  savedMealBanner: string | null
  addedLineBanner: string | null
  saveStateLabel: string
  saveStateTone: 'saved' | 'unsaved' | 'idle'
}

export function PlateMealBuilderIntro({
  savedMealBanner,
  addedLineBanner,
  saveStateLabel,
  saveStateTone,
}: Props) {
  return (
    <div className="plate-meal-builder__intro">
      <header className="plate-meal-builder__head">
        <div className="plate-meal-builder__head-row">
          <h2 className="section-h section-h--flush">Your plate</h2>
          <span
            className={`plate-meal-builder__save-state plate-meal-builder__save-state--${saveStateTone}`}
            role="status"
          >
            {saveStateLabel}
          </span>
        </div>
      </header>

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
