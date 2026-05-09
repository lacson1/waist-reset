import { useId } from 'react'
import type { KeyboardEvent } from 'react'
import type { PlatePickLine } from '../../domain/plateMeal'
import { PlateRoundWedgeLabels } from './PlateRoundWedgeLabels'
import { RoundPlateWedgeGradients } from './roundPlateWedgeGradients'

export type RestDaySlot = 'veg' | 'protein' | 'fibre'

type Props = {
  activeSlot?: RestDaySlot | null
  interactive?: boolean
  onSlotSelect?: (slot: RestDaySlot) => void
  /** Your picks — drawn on the wedge (short lines). */
  slotPicks?: Partial<Record<RestDaySlot, readonly PlatePickLine[]>>
}

function wedgeClass(
  slot: RestDaySlot,
  active: RestDaySlot | null | undefined,
  interactive: boolean | undefined,
  filled: boolean,
) {
  let c = 'plate-wedge'
  if (interactive) c += ' plate-wedge--interactive'
  if (filled) c += ' is-filled'
  if (active === slot) c += ' is-active'
  else if (interactive && active) c += ' is-dim'
  return c
}

export function RestDayPlateSvg({ activeSlot, interactive, onSlotSelect, slotPicks }: Props) {
  const uid = useId().replace(/:/g, '')
  const g = (name: string) => `rd-${uid}-${name}`

  const pick = (slot: RestDaySlot) => {
    if (!interactive || !onSlotSelect) return
    onSlotSelect(slot)
  }

  const onKey = (e: KeyboardEvent, slot: RestDaySlot) => {
    if (!interactive) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSlotSelect?.(slot)
    }
  }

  const wedgeA11y = (slot: RestDaySlot) =>
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
      className="plate-svg plate-svg--rest"
      {...(interactive
        ? {
            role: 'group' as const,
            'aria-label': 'Rest-day plate — tap a wedge or matching bullet',
          }
        : { 'aria-hidden': true })}
    >
      <defs>
        <linearGradient id={g('rim')} x1="12%" y1="8%" x2="88%" y2="96%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#f7f8fa" />
          <stop offset="48%" stopColor="#eceff3" />
          <stop offset="78%" stopColor="#d4dae2" />
          <stop offset="100%" stopColor="#aeb6c2" />
        </linearGradient>
        <radialGradient id={g('rim-shade')} cx="72%" cy="72%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="55%" stopColor="#8a96a6" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#5a6574" stopOpacity="0.22" />
        </radialGradient>
        <RoundPlateWedgeGradients idPrefix={g} fibreOrCarbs="fibre" />
        <radialGradient id={g('hub')} cx="32%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#f8f9fb" />
          <stop offset="50%" stopColor="#eef1f3" />
          <stop offset="100%" stopColor="#cfd5da" />
        </radialGradient>
        <radialGradient id={g('hub-shine')} cx="30%" cy="28%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={g('plate-drop')} x="-45%" y="-45%" width="190%" height="190%">
          <feDropShadow dx="0" dy="10" stdDeviation="8.5" floodColor="#1a2430" floodOpacity="0.18" />
        </filter>
        {/* Same geometry as wedge paths — keeps titles + picks inside each zone */}
        <clipPath id={g('clip-veg')}>
          <path d="M 100 100 L 100 8 A 92 92 0 0 1 100 192 Z" />
        </clipPath>
        <clipPath id={g('clip-protein')}>
          <path d="M 100 100 L 100 192 A 92 92 0 0 1 8 100 Z" />
        </clipPath>
        <clipPath id={g('clip-fibre')}>
          <path d="M 100 100 L 8 100 A 92 92 0 0 1 100 8 Z" />
        </clipPath>
      </defs>

      <ellipse
        cx="100"
        cy="197.2"
        rx="57"
        ry="6.2"
        fill="rgba(18, 28, 36, 0.085)"
        aria-hidden
      />
      <g filter={`url(#${g('plate-drop')})`}>
        <circle cx="100" cy="100" r="93.4" fill="none" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.15" />
        <circle cx="100" cy="100" r="92" fill={`url(#${g('rim')})`} stroke="#9aa6b4" strokeWidth="0.55" />
        <circle cx="100" cy="100" r="92" fill={`url(#${g('rim-shade')})`} />
        <circle cx="100" cy="100" r="88.5" fill="none" stroke="rgba(255, 255, 255, 0.42)" strokeWidth="0.95" />
        <circle cx="100" cy="100" r="86.5" fill="none" stroke="rgba(42, 52, 62, 0.06)" strokeWidth="0.75" />
      </g>

      <path
        className={wedgeClass('veg', activeSlot, interactive, (slotPicks?.veg?.length ?? 0) > 0)}
        d="M 100 100 L 100 8 A 92 92 0 0 1 100 192 Z"
        fill={`url(#${g('veg')})`}
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        aria-label="Half plate vegetables"
        {...wedgeA11y('veg')}
      />
      <path
        className={wedgeClass('protein', activeSlot, interactive, (slotPicks?.protein?.length ?? 0) > 0)}
        d="M 100 100 L 100 192 A 92 92 0 0 1 8 100 Z"
        fill={`url(#${g('protein')})`}
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        aria-label="Quarter plate lean protein"
        {...wedgeA11y('protein')}
      />
      <path
        className={wedgeClass('fibre', activeSlot, interactive, (slotPicks?.fibre?.length ?? 0) > 0)}
        d="M 100 100 L 8 100 A 92 92 0 0 1 100 8 Z"
        fill={`url(#${g('fibre')})`}
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        aria-label="Quarter plate fibre"
        {...wedgeA11y('fibre')}
      />

      <circle cx="100" cy="100" r="13" fill={`url(#${g('hub')})`} stroke="#b8c0c6" strokeWidth="1" pointerEvents="none" />
      <circle cx="100" cy="100" r="13" fill={`url(#${g('hub-shine')})`} pointerEvents="none" />
      <circle cx="95.5" cy="95" r="3.8" fill="#fff" fillOpacity="0.72" pointerEvents="none" />

      <g clipPath={`url(#${g('clip-veg')})`}>
        <PlateRoundWedgeLabels
          cx={128}
          titleY={100}
          title="½ Veg"
          lines={slotPicks?.veg}
          titleTransform="translate(-7, 0)"
          picksTransform="translate(7, 2)"
          picksLeadGap={14}
        />
      </g>
      <g clipPath={`url(#${g('clip-protein')})`}>
        <PlateRoundWedgeLabels
          cx={78}
          titleY={116}
          title="¼ Protein"
          lines={slotPicks?.protein}
          titleTransform="translate(4, -6)"
          picksTransform="translate(4, 5)"
          picksLeadGap={9}
        />
      </g>
      <g clipPath={`url(#${g('clip-fibre')})`}>
        <PlateRoundWedgeLabels
          cx={74}
          titleY={70}
          title="¼ Fibre"
          lines={slotPicks?.fibre}
          titleTransform="translate(5, 6)"
          picksTransform="translate(4, -4)"
          picksLeadGap={6}
        />
      </g>
    </svg>
  )
}
