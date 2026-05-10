/**
 * Decorative food illustrations layered onto the round plate + soup bowl SVGs.
 * Each component is positioned absolutely inside the 200×200 viewBox of its
 * parent plate; coordinates are tuned to sit inside a single wedge or layer
 * without colliding with the centre hub or the picks/labels rendered on top.
 *
 * pointerEvents="none" everywhere — clicks always pass through to the wedge
 * paths underneath so the existing slot-selection a11y is preserved.
 */
import type { ReactNode } from 'react'

type ArtProps = {
  /** Generated id prefix from useId() so multiple plates on one page don't share gradient ids. */
  g: (k: string) => string
}

export function PlateFoodArtDefs({ g }: ArtProps): ReactNode {
  return (
    <>
      <linearGradient id={g('art-leaf')} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5a8c5d" />
        <stop offset="60%" stopColor="#3d6b4a" />
        <stop offset="100%" stopColor="#2a4d36" />
      </linearGradient>
      <linearGradient id={g('art-leaf-light')} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7da97e" />
        <stop offset="100%" stopColor="#4a7d4f" />
      </linearGradient>
      <radialGradient id={g('art-meat')} cx="35%" cy="32%" r="80%">
        <stop offset="0%" stopColor="#a36b40" />
        <stop offset="55%" stopColor="#7d4a2a" />
        <stop offset="100%" stopColor="#4a2a18" />
      </radialGradient>
      <radialGradient id={g('art-spud')} cx="35%" cy="30%" r="78%">
        <stop offset="0%" stopColor="#ecd29a" />
        <stop offset="60%" stopColor="#cfa766" />
        <stop offset="100%" stopColor="#9a7a44" />
      </radialGradient>
      <radialGradient id={g('art-broth')} cx="50%" cy="40%" r="80%">
        <stop offset="0%" stopColor="#d2724a" />
        <stop offset="55%" stopColor="#b85530" />
        <stop offset="100%" stopColor="#7e3018" />
      </radialGradient>
    </>
  )
}

/** A single tapered leaf shape — pointy at both ends. */
function Leaf({
  cx,
  cy,
  rotate,
  scale = 1,
  fillId,
  vein = '#1f4030',
}: {
  cx: number
  cy: number
  rotate: number
  scale?: number
  fillId: string
  vein?: string
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`} pointerEvents="none">
      <path
        d="M0,0 Q12,-9 24,0 Q12,9 0,0 Z"
        fill={`url(#${fillId})`}
        stroke="#1f4030"
        strokeOpacity="0.35"
        strokeWidth="0.4"
      />
      <path d="M2,0 L22,0" stroke={vein} strokeOpacity="0.55" strokeWidth="0.6" fill="none" />
      <path
        d="M8,-0.5 Q10,-2.5 12,-3"
        stroke={vein}
        strokeOpacity="0.35"
        strokeWidth="0.4"
        fill="none"
      />
      <path
        d="M14,0.5 Q16,2.5 18,3"
        stroke={vein}
        strokeOpacity="0.35"
        strokeWidth="0.4"
        fill="none"
      />
    </g>
  )
}

/**
 * Vegetables — half-plate of leafy greens. Drawn in the right semicircle.
 * 4 overlapping leaves of varied scale + a small cherry-tomato accent.
 */
export function VegLeaves({ g }: ArtProps): ReactNode {
  return (
    <g pointerEvents="none">
      <Leaf cx={158} cy={70} rotate={28} scale={1.05} fillId={g('art-leaf')} />
      <Leaf cx={148} cy={108} rotate={-14} scale={1.25} fillId={g('art-leaf-light')} />
      <Leaf cx={160} cy={138} rotate={20} scale={1.0} fillId={g('art-leaf')} />
      <Leaf cx={132} cy={88} rotate={62} scale={0.9} fillId={g('art-leaf-light')} />
      <Leaf cx={138} cy={158} rotate={-32} scale={0.95} fillId={g('art-leaf')} />
      {/* cherry tomato */}
      <circle cx="172" cy="118" r="2.6" fill="#c64530" pointerEvents="none" />
      <circle cx="171.2" cy="117.2" r="0.9" fill="#ff8470" fillOpacity="0.85" pointerEvents="none" />
    </g>
  )
}

/** Protein — grilled cut, bottom-left quarter. */
export function ProteinCut({ g }: ArtProps): ReactNode {
  return (
    <g transform="translate(63 145) rotate(-18)" pointerEvents="none">
      <ellipse rx="22" ry="13" fill={`url(#${g('art-meat')})`} stroke="#3a2010" strokeWidth="0.7" />
      <path d="M-14,-4 Q0,-2.6 13,-4.3" stroke="#2a1808" strokeWidth="0.9" fill="none" strokeOpacity="0.55" />
      <path d="M-15,1 Q0,2.5 14,0.6" stroke="#2a1808" strokeWidth="0.9" fill="none" strokeOpacity="0.55" />
      <path d="M-13,5.5 Q0,7 12,5" stroke="#2a1808" strokeWidth="0.9" fill="none" strokeOpacity="0.5" />
      <ellipse cx="-7" cy="-6" rx="6" ry="2" fill="#fff" fillOpacity="0.18" />
    </g>
  )
}

/** Legumes — cluster of small beans/grains, top-left quarter. */
export function Legumes(): ReactNode {
  const beans: Array<[number, number, string]> = [
    [-12, -8, '#c19a52'],
    [-6, -10, '#a98545'],
    [0, -8, '#c8a45a'],
    [6, -10, '#a98545'],
    [-14, -2, '#a98545'],
    [-8, -3, '#c8a45a'],
    [-2, -2, '#a98545'],
    [4, -3, '#c19a52'],
    [10, -2, '#a98545'],
    [-10, 4, '#c8a45a'],
    [-3, 5, '#a98545'],
    [3, 4, '#c19a52'],
    [9, 5, '#a98545'],
    [-6, 10, '#a98545'],
    [1, 11, '#c8a45a'],
  ]
  return (
    <g transform="translate(60 58)" pointerEvents="none">
      {beans.map(([x, y, c], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2" ry="1.6" fill={c} stroke="#7a5a28" strokeOpacity="0.35" strokeWidth="0.3" />
      ))}
    </g>
  )
}

/** Slow carbs — 4 potato/yam ovals, top-left quarter. */
export function SlowCarbs({ g }: ArtProps): ReactNode {
  return (
    <g transform="translate(58 60)" pointerEvents="none">
      <ellipse cx="-12" cy="-6" rx="6" ry="4.5" fill={`url(#${g('art-spud')})`} stroke="#7a5828" strokeOpacity="0.5" strokeWidth="0.5" />
      <ellipse cx="0" cy="-9" rx="6.5" ry="5" fill={`url(#${g('art-spud')})`} stroke="#7a5828" strokeOpacity="0.5" strokeWidth="0.5" />
      <ellipse cx="11" cy="-4" rx="6" ry="4.5" fill={`url(#${g('art-spud')})`} stroke="#7a5828" strokeOpacity="0.5" strokeWidth="0.5" />
      <ellipse cx="-4" cy="6" rx="6.5" ry="4.8" fill={`url(#${g('art-spud')})`} stroke="#7a5828" strokeOpacity="0.5" strokeWidth="0.5" />
      <ellipse cx="8" cy="9" rx="5.5" ry="4.2" fill={`url(#${g('art-spud')})`} stroke="#7a5828" strokeOpacity="0.5" strokeWidth="0.5" />
      {/* sheen */}
      <ellipse cx="-13" cy="-7.5" rx="2.2" ry="1.2" fill="#fff" fillOpacity="0.4" />
      <ellipse cx="-1.5" cy="-10.5" rx="2.5" ry="1.3" fill="#fff" fillOpacity="0.4" />
    </g>
  )
}

/** Drizzle marker — small EVOO/avocado wedge near plate centre. */
export function DrizzleAccent({ x, y }: { x: number; y: number }): ReactNode {
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      <path d="M-4,-3 L4,-3 L0,4 Z" fill="#e3b440" stroke="#a87a18" strokeOpacity="0.6" strokeWidth="0.4" />
      <path d="M-3,-2.4 L3,-2.4" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.6" />
    </g>
  )
}

/** Floating greens — small leaf flecks for the soup bowl surface. */
export function BowlGreens({ g }: ArtProps): ReactNode {
  return (
    <g pointerEvents="none">
      <Leaf cx={70} cy={92} rotate={-14} scale={0.55} fillId={g('art-leaf')} />
      <Leaf cx={130} cy={86} rotate={22} scale={0.5} fillId={g('art-leaf-light')} />
      <Leaf cx={88} cy={118} rotate={42} scale={0.45} fillId={g('art-leaf')} />
      <Leaf cx={142} cy={120} rotate={-38} scale={0.5} fillId={g('art-leaf-light')} />
      <Leaf cx={108} cy={132} rotate={8} scale={0.4} fillId={g('art-leaf')} />
    </g>
  )
}

/** Boiled-egg cross-section + a couple of aromatic seeds for the soup. */
export function BowlGarnish(): ReactNode {
  return (
    <g pointerEvents="none">
      <g transform="translate(118 100)">
        <ellipse rx="6.2" ry="5.6" fill="#fbf6e6" stroke="#d8c789" strokeWidth="0.5" />
        <ellipse rx="2.6" ry="2.4" fill="#f3c542" stroke="#c79728" strokeOpacity="0.6" strokeWidth="0.3" />
        <ellipse cx="-1.5" cy="-1.5" rx="0.8" ry="0.5" fill="#fff" fillOpacity="0.85" />
      </g>
      <g transform="translate(80 108)">
        <ellipse rx="5.4" ry="4.8" fill="#fbf6e6" stroke="#d8c789" strokeWidth="0.5" />
        <ellipse rx="2.2" ry="2" fill="#f3c542" stroke="#c79728" strokeOpacity="0.6" strokeWidth="0.3" />
      </g>
      {/* peppercorns */}
      <circle cx="100" cy="115" r="1.2" fill="#3a2418" />
      <circle cx="106" cy="120" r="1.1" fill="#3a2418" />
      <circle cx="92" cy="118" r="1.1" fill="#3a2418" />
      <circle cx="124" cy="122" r="1.1" fill="#3a2418" />
    </g>
  )
}
