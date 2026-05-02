export function TrainingDayPlateSvg() {
  return (
    <svg viewBox="0 0 200 200" className="plate-svg" aria-hidden>
      <circle cx="100" cy="100" r="92" fill="#fff" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M 100 100 L 100 8 A 92 92 0 0 1 100 192 Z" fill="#dde8d3" opacity="0.85" />
      <path d="M 100 100 L 100 192 A 92 92 0 0 0 8 100 Z" fill="#f6e1d5" opacity="0.85" />
      <path d="M 100 100 L 8 100 A 92 92 0 0 1 100 8 Z" fill="#fdf5ef" opacity="0.95" />
      <circle cx="100" cy="100" r="6" fill="#fff" stroke="var(--text-tertiary)" strokeWidth="1.5" />
      <text x="135" y="55" fontSize="12" fontWeight="600" fill="var(--text-primary)">
        ½ Veg
      </text>
      <text x="58" y="155" fontSize="12" fontWeight="600" fill="var(--text-primary)">
        ¼ Protein
      </text>
      <text x="22" y="55" fontSize="12" fontWeight="600" fill="var(--clay)">
        ¼ Carbs
      </text>
    </svg>
  )
}
