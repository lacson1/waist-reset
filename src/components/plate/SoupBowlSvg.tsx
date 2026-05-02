export function SoupBowlSvg() {
  return (
    <svg viewBox="0 0 200 200" className="plate-svg" aria-hidden>
      <ellipse cx="100" cy="115" rx="92" ry="60" fill="#fff" stroke="var(--border-strong)" strokeWidth="2" />
      <ellipse cx="100" cy="105" rx="84" ry="50" fill="#ead7df" opacity="0.6" />
      <ellipse
        cx="100"
        cy="105"
        rx="84"
        ry="50"
        fill="none"
        stroke="#7a3b5c"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.4"
      />
      <text x="100" y="108" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--plum)">
        One bowl
      </text>
      <text x="100" y="55" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">
        Steam · aromatics · protein
      </text>
      <path d="M 80 30 Q 85 20 80 10" stroke="var(--text-tertiary)" strokeWidth="1.5" fill="none" />
      <path d="M 100 28 Q 105 18 100 8" stroke="var(--text-tertiary)" strokeWidth="1.5" fill="none" />
      <path d="M 120 30 Q 125 20 120 10" stroke="var(--text-tertiary)" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
