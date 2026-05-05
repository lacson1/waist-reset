import { useEffect, type ReactNode } from 'react'

type Props = {
  open: boolean
  titleId: string
  title: string
  body: ReactNode
  cancelLabel?: string
  confirmLabel: string
  confirmTestId?: string
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Modal pattern used for both "Switch template?" and "Reset the plate builder?".
 * Backdrop click cancels, Escape cancels, Enter is intentionally NOT bound to
 * confirm so destructive actions stay deliberate.
 */
export function PlateConfirmDialog({
  open,
  titleId,
  title,
  body,
  cancelLabel = 'Cancel',
  confirmLabel,
  confirmTestId,
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="plate-meal-builder__backdrop" role="presentation" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="plate-meal-builder__dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id={titleId} className="plate-meal-builder__dialog-title">
          {title}
        </h3>
        <div className="plate-meal-builder__dialog-body">{body}</div>
        <div className="plate-meal-builder__dialog-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn"
            data-testid={confirmTestId}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
