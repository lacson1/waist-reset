import { useId } from 'react'
import type { KeyboardEvent } from 'react'

export type SoupBowlSlot = 'base' | 'protein' | 'leafy' | 'aromatics' | 'optional'

type Props = {
  activeSlot?: SoupBowlSlot | null
  interactive?: boolean
  onSlotSelect?: (slot: SoupBowlSlot) => void
}

const LAYER_META: { slot: SoupBowlSlot; y: number; h: number; g0: string; g1: string }[] = [
  { slot: 'optional', y: 54, h: 22, g0: '#fff5f0', g1: '#edd6d0' },
  { slot: 'aromatics', y: 76, h: 21, g0: '#f8e8ee', g1: '#e2c2ce' },
  { slot: 'leafy', y: 97, h: 21, g0: '#f0dfe8', g1: '#d9b6c8' },
  { slot: 'protein', y: 118, h: 20, g0: '#ead4df', g1: '#cf9fb4' },
  { slot: 'base', y: 138, h: 22, g0: '#e0c8d6', g1: '#b87a95' },
]

function layerClass(slot: SoupBowlSlot, active: SoupBowlSlot | null | undefined, interactive: boolean | undefined) {
  let c = 'bowl-layer'
  if (interactive) c += ' plate-wedge--interactive'
  if (active === slot) c += ' is-active'
  else if (interactive && active) c += ' is-dim'
  return c
}

function BowlDecor() {
  return (
    <>
      <text className="plate-svg-label plate-svg-label--bowl-title" x="100" y="108" textAnchor="middle" pointerEvents="none">
        One bowl
      </text>
      <text className="plate-svg-label plate-svg-label--bowl-sub" x="100" y="54" textAnchor="middle" pointerEvents="none">
        Steam · aromatics · protein
      </text>
      <path
        d="M 80 32 Q 84 22 80 12"
        stroke="#9a8a96"
        strokeOpacity="0.4"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        pointerEvents="none"
      />
      <path
        d="M 100 30 Q 104 18 100 8"
        stroke="#9a8a96"
        strokeOpacity="0.45"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        pointerEvents="none"
      />
      <path
        d="M 120 32 Q 124 22 120 12"
        stroke="#9a8a96"
        strokeOpacity="0.4"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        pointerEvents="none"
      />
    </>
  )
}

export function SoupBowlSvg(props: Partial<Props> = {}) {
  const { activeSlot, interactive, onSlotSelect } = props
  const uid = useId().replace(/:/g, '')
  const g = (name: string) => `sb-${uid}-${name}`
  const clipId = g('clip')

  if (!interactive) {
    return (
      <svg viewBox="0 0 200 200" className="plate-svg plate-svg--bowl" aria-hidden>
        <defs>
          <linearGradient id={g('bowl-rim')} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f7f4f0" />
            <stop offset="100%" stopColor="#e8e2dc" />
          </linearGradient>
          <radialGradient id={g('liquid')} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#f5e8ee" />
            <stop offset="55%" stopColor="#e8ccd8" />
            <stop offset="100%" stopColor="#c89aae" />
          </radialGradient>
          <linearGradient id={g('surface')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id={g('bowl-shadow')} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#3d1f2d" floodOpacity="0.12" />
          </filter>
        </defs>
        <g filter={`url(#${g('bowl-shadow')})`}>
          <ellipse cx="100" cy="115" rx="92" ry="60" fill={`url(#${g('bowl-rim')})`} stroke="#d4cbc4" strokeWidth="1.25" />
        </g>
        <ellipse cx="100" cy="105" rx="84" ry="50" fill={`url(#${g('liquid')})`} stroke="#a86b84" strokeWidth="0.75" strokeOpacity="0.35" />
        <ellipse cx="100" cy="98" rx="72" ry="22" fill={`url(#${g('surface')})`} pointerEvents="none" />
        <ellipse
          cx="100"
          cy="105"
          rx="84"
          ry="50"
          fill="none"
          stroke="#8e2a4d"
          strokeWidth="1"
          strokeDasharray="4 5"
          strokeOpacity="0.28"
        />
        <BowlDecor />
      </svg>
    )
  }

  const pick = (slot: SoupBowlSlot) => {
    onSlotSelect?.(slot)
  }

  const onKey = (e: KeyboardEvent, slot: SoupBowlSlot) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSlotSelect?.(slot)
    }
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className="plate-svg plate-svg--bowl"
      role="group"
      aria-label="Soup bowl — tap a layer or matching bullet"
    >
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="100" cy="105" rx="84" ry="50" />
        </clipPath>
        <linearGradient id={g('bowl-rim')} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f7f4f0" />
          <stop offset="100%" stopColor="#e8e2dc" />
        </linearGradient>
        <linearGradient id={g('surface')} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={g('bowl-shadow')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#3d1f2d" floodOpacity="0.12" />
        </filter>
        {LAYER_META.map(({ slot, g0, g1 }) => (
          <linearGradient key={slot} id={g(`ly-${slot}`)} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={g1} />
            <stop offset="100%" stopColor={g0} />
          </linearGradient>
        ))}
      </defs>

      <g filter={`url(#${g('bowl-shadow')})`}>
        <ellipse cx="100" cy="115" rx="92" ry="60" fill={`url(#${g('bowl-rim')})`} stroke="#d4cbc4" strokeWidth="1.25" />
      </g>

      <g clipPath={`url(#${clipId})`}>
        {LAYER_META.map(({ slot, y, h }) => (
          <rect
            key={slot}
            className={layerClass(slot, activeSlot, true)}
            x="16"
            y={y}
            width="168"
            height={h}
            fill={`url(#${g(`ly-${slot}`)})`}
            stroke="rgba(142, 42, 77, 0.18)"
            strokeWidth="1"
            tabIndex={0}
            role="button"
            aria-label={
              slot === 'base'
                ? 'Base layer'
                : slot === 'protein'
                  ? 'Protein anchor'
                  : slot === 'leafy'
                    ? 'Leafy volume'
                    : slot === 'aromatics'
                      ? 'Aromatics'
                      : 'Optional add-on'
            }
            aria-pressed={activeSlot === slot}
            onClick={() => pick(slot)}
            onKeyDown={(e) => onKey(e, slot)}
          />
        ))}
        <ellipse cx="100" cy="98" rx="76" ry="20" fill={`url(#${g('surface')})`} pointerEvents="none" />
        <ellipse cx="100" cy="105" rx="84" ry="50" fill="none" stroke="#8e2a4d" strokeWidth="1" strokeDasharray="4 5" strokeOpacity="0.22" pointerEvents="none" />
      </g>

      <BowlDecor />
    </svg>
  )
}
