import { useId } from 'react'
import type { KeyboardEvent } from 'react'

export type TrainingDaySlot = 'veg' | 'protein' | 'carbs'

type Props = {
  activeSlot?: TrainingDaySlot | null
  interactive?: boolean
  onSlotSelect?: (slot: TrainingDaySlot) => void
}

function wedgeClass(slot: TrainingDaySlot, active: TrainingDaySlot | null | undefined, interactive: boolean | undefined) {
  let c = 'plate-wedge'
  if (interactive) c += ' plate-wedge--interactive'
  if (active === slot) c += ' is-active'
  else if (interactive && active) c += ' is-dim'
  return c
}

export function TrainingDayPlateSvg({ activeSlot, interactive, onSlotSelect }: Props) {
  const uid = useId().replace(/:/g, '')
  const g = (name: string) => `td-${uid}-${name}`

  const pick = (slot: TrainingDaySlot) => {
    if (!interactive || !onSlotSelect) return
    onSlotSelect(slot)
  }

  const onKey = (e: KeyboardEvent, slot: TrainingDaySlot) => {
    if (!interactive) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSlotSelect?.(slot)
    }
  }

  const wedgeA11y = (slot: TrainingDaySlot) =>
    interactive
      ? {
          tabIndex: 0 as const,
          role: 'button' as const,
          'aria-pressed': activeSlot === slot,
          onClick: () => pick(slot),
          onKeyDown: (e: KeyboardEvent) => onKey(e, slot),
        }
      : {}

  return (
    <svg
      viewBox="0 0 200 200"
      className="plate-svg plate-svg--training"
      role={interactive ? 'group' : undefined}
      aria-hidden={interactive ? undefined : true}
      aria-label={interactive ? 'Training-day plate — tap a wedge or matching bullet' : undefined}
    >
      <defs>
        <linearGradient id={g('rim')} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdfcfa" />
          <stop offset="40%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ebe8e0" />
        </linearGradient>
        <linearGradient id={g('veg')} x1="22%" y1="0%" x2="78%" y2="100%">
          <stop offset="0%" stopColor="#d8e6cc" />
          <stop offset="50%" stopColor="#b6cfaa" />
          <stop offset="100%" stopColor="#8aa67e" />
        </linearGradient>
        <linearGradient id={g('protein')} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcefe6" />
          <stop offset="50%" stopColor="#e8c9b4" />
          <stop offset="100%" stopColor="#d4a88f" />
        </linearGradient>
        <linearGradient id={g('carbs')} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff9f2" />
          <stop offset="40%" stopColor="#f0dcc8" />
          <stop offset="100%" stopColor="#d9a080" />
        </linearGradient>
        <radialGradient id={g('hub')} cx="32%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f2efe8" />
          <stop offset="100%" stopColor="#c9c0b4" />
        </radialGradient>
        <radialGradient id={g('hub-shine')} cx="30%" cy="28%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={g('plate-drop')} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#16201f" floodOpacity="0.08" />
        </filter>
      </defs>

      <g filter={`url(#${g('plate-drop')})`}>
        <circle cx="100" cy="100" r="92" fill={`url(#${g('rim')})`} stroke="#d5d0c6" strokeWidth="1.25" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.55" />
      </g>

      <path
        className={wedgeClass('veg', activeSlot, interactive)}
        d="M 100 100 L 100 8 A 92 92 0 0 1 100 192 Z"
        fill={`url(#${g('veg')})`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        aria-label="Half plate vegetables"
        {...wedgeA11y('veg')}
      />
      <path
        className={wedgeClass('protein', activeSlot, interactive)}
        d="M 100 100 L 100 192 A 92 92 0 0 1 8 100 Z"
        fill={`url(#${g('protein')})`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        aria-label="Quarter plate lean protein"
        {...wedgeA11y('protein')}
      />
      <path
        className={wedgeClass('carbs', activeSlot, interactive)}
        d="M 100 100 L 8 100 A 92 92 0 0 1 100 8 Z"
        fill={`url(#${g('carbs')})`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        aria-label="Quarter plate slow carbs"
        {...wedgeA11y('carbs')}
      />

      <circle cx="100" cy="100" r="13" fill={`url(#${g('hub')})`} stroke="#b8b0a4" strokeWidth="1" pointerEvents="none" />
      <circle cx="100" cy="100" r="13" fill={`url(#${g('hub-shine')})`} pointerEvents="none" />
      <circle cx="95.5" cy="95" r="3.8" fill="#fff" fillOpacity="0.72" pointerEvents="none" />

      <text className="plate-svg-label" x="138" y="54" pointerEvents="none">
        ½ Veg
      </text>
      <text className="plate-svg-label" x="58" y="158" pointerEvents="none">
        ¼ Protein
      </text>
      <text className="plate-svg-label plate-svg-label--clay" x="22" y="54" pointerEvents="none">
        ¼ Carbs
      </text>
    </svg>
  )
}
