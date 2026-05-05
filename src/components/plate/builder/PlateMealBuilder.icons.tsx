/**
 * Inline SVG glyphs used by the plate meal builder. Kept as plain
 * functional components so they can be imported without bundling
 * an icon library.
 */

/** Catalog-style glyph (food list / database). */
export function IconDatabasePanel() {
  return (
    <svg
      className="plate-meal-builder__panel-icon-glyph"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden
    >
      <rect
        x="3.25"
        y="4.25"
        width="17.5"
        height="15.5"
        rx="2.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 9.25h8.5M7.75 12.75h8.5M7.75 16.25h5.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Horizontal sliders — tuned macros / custom line. */
export function IconCustomPanel() {
  return (
    <svg
      className="plate-meal-builder__panel-icon-glyph"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden
    >
      <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="14" cy="7" r="2.35" fill="var(--bg-card)" stroke="currentColor" strokeWidth="1.75" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="9" cy="12" r="2.35" fill="var(--bg-card)" stroke="currentColor" strokeWidth="1.75" />
      <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="17" cy="17" r="2.35" fill="var(--bg-card)" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

/** Trash — remove meal line (label via aria on button). */
export function IconRemoveLine() {
  return (
    <svg
      className="plate-meal-builder__line-remove-glyph"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden
    >
      <path
        d="M9 3.25h6a.75.75 0 01.74.65l.06.6h3.7a.75.75 0 010 1.5H4.5a.75.75 0 010-1.5h3.7l.06-.6a.75.75 0 01.74-.65zM7.25 8h9.5l-.65 11.35a1.25 1.25 0 01-1.24 1.15H9.14a1.25 1.25 0 01-1.24-1.15L7.25 8z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  )
}

/** Kebab — overflow menu for compact "add sources" row. */
export function IconMoreVertical() {
  return (
    <svg
      className="plate-meal-builder__overflow-icon"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      aria-hidden
    >
      <circle cx="12" cy="5" r="1.85" fill="currentColor" />
      <circle cx="12" cy="12" r="1.85" fill="currentColor" />
      <circle cx="12" cy="19" r="1.85" fill="currentColor" />
    </svg>
  )
}

/** Camera + sparkle hint for vision / photo estimate. */
export function IconPhotoEstimate() {
  return (
    <svg
      className="plate-meal-builder__panel-icon-glyph"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden
    >
      <path
        d="M4 9.25V17.5A1.25 1.25 0 005.25 18.75h13.5A1.25 1.25 0 0020 17.5V9.25a1.25 1.25 0 00-1.25-1.25h-2.35L15.15 5.5h-6.3L7.6 8H5.25A1.25 1.25 0 004 9.25z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.75" r="3.15" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M19.25 5.5l.28.85.85.28-.85.28-.28.85-.28-.85-.85-.28.85-.28z"
        fill="currentColor"
        opacity="0.88"
      />
    </svg>
  )
}
