import { useId } from 'react'
import type { KeyboardEvent } from 'react'
import type { PlatePickLine } from '../../domain/plateMeal'
import type { FoodTypeKind } from './foodTypeMeta'
import { foodTypeKind } from './foodTypeMeta'
import { FoodTypeGlyph } from './FoodTypeIcon'
import { wrapPlatePickLabel } from './platePickLabelWrap'
import { BowlGarnish, BowlGreens, PlateFoodArtDefs } from './PlateFoodArt'

export type SoupBowlSlot = 'base' | 'protein' | 'leafy' | 'aromatics' | 'optional'

type Props = {
  activeSlot?: SoupBowlSlot | null
  interactive?: boolean
  onSlotSelect?: (slot: SoupBowlSlot) => void
  slotPicks?: Partial<Record<SoupBowlSlot, readonly PlatePickLine[]>>
}

const LAYER_META: { slot: SoupBowlSlot; y: number; h: number; g0: string; g1: string }[] = [
  { slot: 'optional', y: 54, h: 22, g0: '#faf9f8', g1: '#e4e1de' },
  { slot: 'aromatics', y: 76, h: 21, g0: '#f5f3ef', g1: '#d9d4cc' },
  { slot: 'leafy', y: 97, h: 21, g0: '#eef4f1', g1: '#a8bfb4' },
  { slot: 'protein', y: 118, h: 20, g0: '#f1eef4', g1: '#b5adbc' },
  { slot: 'base', y: 138, h: 22, g0: '#dcd8e2', g1: '#7d7788' },
]

function layerClass(
  slot: SoupBowlSlot,
  active: SoupBowlSlot | null | undefined,
  interactive: boolean | undefined,
  filled: boolean,
) {
  let c = 'bowl-layer'
  if (interactive) c += ' plate-wedge--interactive'
  if (filled) c += ' is-filled'
  if (active === slot) c += ' is-active'
  else if (interactive && active) c += ' is-dim'
  return c
}

function BowlSteam() {
  return (
    <>
      <path
        d="M 80 32 Q 84 22 80 12"
        stroke="#a8aeb4"
        strokeOpacity="0.38"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        pointerEvents="none"
      />
      <path
        d="M 100 30 Q 104 18 100 8"
        stroke="#a8aeb4"
        strokeOpacity="0.42"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        pointerEvents="none"
      />
      <path
        d="M 120 32 Q 124 22 120 12"
        stroke="#a8aeb4"
        strokeOpacity="0.38"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        pointerEvents="none"
      />
    </>
  )
}

const BOWL_PICK_ICON_X = 68
const BOWL_PICK_ICON_W = 6.75
const BOWL_PICK_ICON_GAP = 3.5
const BOWL_PICK_HALO_R = 5.65

const BOWL_PICK_LINE_CHARS = 22
const BOWL_PICK_TSPAN_DY = 5.15

function BowlPickLine({ y, line }: { y: number; line: PlatePickLine }) {
  const kind: FoodTypeKind | null = line.type ? foodTypeKind(line.type) : null
  const textX = BOWL_PICK_ICON_X + BOWL_PICK_ICON_W + BOWL_PICK_ICON_GAP
  const wrapped = wrapPlatePickLabel(line.label, BOWL_PICK_LINE_CHARS)
  const lineCount = wrapped.length
  const yFirst = y - ((lineCount - 1) * BOWL_PICK_TSPAN_DY) / 2
  const iconYOffset = lineCount > 1 ? ((lineCount - 1) * BOWL_PICK_TSPAN_DY) / 2 : 0
  const iconCx = BOWL_PICK_ICON_X + BOWL_PICK_ICON_W / 2
  const iconCy = yFirst - 5.5 + BOWL_PICK_ICON_W / 2 + iconYOffset
  return (
    <g pointerEvents="none">
      {kind != null && (
        <>
          <circle
            className="plate-svg-pick-halo plate-svg-pick-halo--bowl"
            data-kind={kind}
            cx={iconCx}
            cy={iconCy}
            r={BOWL_PICK_HALO_R}
          />
          <svg
            x={BOWL_PICK_ICON_X}
            y={yFirst - 5.5 + iconYOffset}
            width={BOWL_PICK_ICON_W}
            height={BOWL_PICK_ICON_W}
            viewBox="0 0 24 24"
            className="plate-svg-pick-icon"
            data-kind={kind}
          >
            <FoodTypeGlyph kind={kind} />
          </svg>
        </>
      )}
      <text
        className="plate-svg-pick plate-svg-pick--bowl plate-svg-pick--imprint-bowl"
        x={kind != null ? textX : 100}
        y={yFirst}
        textAnchor={kind != null ? 'start' : 'middle'}
      >
        <title>{line.label}</title>
        {wrapped.map((ln, li) => (
          <tspan key={li} x={kind != null ? textX : 100} dy={li === 0 ? 0 : BOWL_PICK_TSPAN_DY}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

export function SoupBowlSvg(props: Partial<Props> = {}) {
  const { activeSlot, interactive, onSlotSelect, slotPicks } = props
  const uid = useId().replace(/:/g, '')
  const g = (name: string) => `sb-${uid}-${name}`
  const clipId = g('clip')

  if (!interactive) {
    return (
      <svg viewBox="0 0 200 200" className="plate-svg plate-svg--bowl" aria-hidden>
        <defs>
          <linearGradient id={g('bowl-rim')} x1="14%" y1="10%" x2="86%" y2="94%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="28%" stopColor="#f4f5f9" />
            <stop offset="100%" stopColor="#c4cad5" />
          </linearGradient>
          <radialGradient id={g('bowl-rim-shade')} cx="70%" cy="78%" r="88%">
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#5c6370" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id={g('liquid')} cx="48%" cy="36%" r="78%">
            <stop offset="0%" stopColor="#e89368" />
            <stop offset="50%" stopColor="#c25a3a" />
            <stop offset="100%" stopColor="#6e2812" />
          </radialGradient>
          <PlateFoodArtDefs g={g} />
          <linearGradient id={g('surface')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id={g('bowl-shadow')} x="-45%" y="-45%" width="190%" height="190%">
            <feDropShadow dx="0" dy="10" stdDeviation="8.5" floodColor="#1a1824" floodOpacity="0.17" />
          </filter>
        </defs>
        <ellipse cx="100" cy="179.5" rx="54" ry="5.8" fill="rgba(18, 16, 28, 0.09)" />
        <g filter={`url(#${g('bowl-shadow')})`}>
          <ellipse cx="100" cy="115" rx="93.5" ry="61.2" fill="none" stroke="rgba(255, 255, 255, 0.48)" strokeWidth="1.05" />
          <ellipse cx="100" cy="115" rx="92" ry="60" fill={`url(#${g('bowl-rim')})`} stroke="#9aa3b0" strokeWidth="0.55" />
          <ellipse cx="100" cy="115" rx="92" ry="60" fill={`url(#${g('bowl-rim-shade')})`} />
        </g>
        <ellipse cx="100" cy="105" rx="84" ry="50" fill={`url(#${g('liquid')})`} stroke="#7c2810" strokeWidth="0.65" strokeOpacity="0.55" />
        <ellipse cx="100" cy="98" rx="72" ry="22" fill={`url(#${g('surface')})`} pointerEvents="none" />
        <BowlGreens g={g} />
        <BowlGarnish />
        <BowlSteam />
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
        <linearGradient id={g('bowl-rim')} x1="14%" y1="10%" x2="86%" y2="94%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="28%" stopColor="#f4f5f9" />
          <stop offset="100%" stopColor="#c4cad5" />
        </linearGradient>
        <radialGradient id={g('bowl-rim-shade')} cx="70%" cy="78%" r="88%">
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#5c6370" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id={g('bowl-depth')} cx="50%" cy="72%" r="78%">
          <stop offset="0%" stopColor="#5c5468" stopOpacity="0" />
          <stop offset="70%" stopColor="#3f384c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2a2535" stopOpacity="0.38" />
        </radialGradient>
        <linearGradient id={g('surface')} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={g('bowl-shadow')} x="-45%" y="-45%" width="190%" height="190%">
          <feDropShadow dx="0" dy="10" stdDeviation="8.5" floodColor="#1a1824" floodOpacity="0.17" />
        </filter>
        {LAYER_META.map(({ slot, g0, g1 }) => (
          <linearGradient key={slot} id={g(`ly-${slot}`)} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={g1} />
            <stop offset="100%" stopColor={g0} />
          </linearGradient>
        ))}
        <PlateFoodArtDefs g={g} />
      </defs>

      <ellipse cx="100" cy="179.5" rx="54" ry="5.8" fill="rgba(18, 16, 28, 0.09)" />
      <g filter={`url(#${g('bowl-shadow')})`}>
        <ellipse cx="100" cy="115" rx="93.5" ry="61.2" fill="none" stroke="rgba(255, 255, 255, 0.48)" strokeWidth="1.05" />
        <ellipse cx="100" cy="115" rx="92" ry="60" fill={`url(#${g('bowl-rim')})`} stroke="#9aa3b0" strokeWidth="0.55" />
        <ellipse cx="100" cy="115" rx="92" ry="60" fill={`url(#${g('bowl-rim-shade')})`} />
      </g>

      <g clipPath={`url(#${clipId})`}>
        <ellipse cx="100" cy="118" rx="80" ry="44" fill={`url(#${g('bowl-depth')})`} pointerEvents="none" />
        {LAYER_META.map(({ slot, y, h }) => (
          <rect
            key={slot}
            className={layerClass(slot, activeSlot, true, (slotPicks?.[slot]?.length ?? 0) > 0)}
            x="16"
            y={y}
            width="168"
            height={h}
            fill={`url(#${g(`ly-${slot}`)})`}
            stroke="rgba(22, 32, 31, 0.14)"
            strokeWidth="1"
            tabIndex={0}
            role="button"
            aria-label={
              `${slot === 'base'
                ? 'Base layer'
                : slot === 'protein'
                  ? 'Protein anchor'
                  : slot === 'leafy'
                    ? 'Leafy volume'
                    : slot === 'aromatics'
                      ? 'Aromatics'
                      : 'Optional add-on'}${activeSlot === slot ? ', selected' : ''}`
            }
            onClick={() => pick(slot)}
            onKeyDown={(e) => onKey(e, slot)}
          />
        ))}
        <ellipse cx="100" cy="98" rx="76" ry="20" fill={`url(#${g('surface')})`} pointerEvents="none" />
        <BowlGreens g={g} />
        <BowlGarnish />
      </g>

      <text className="plate-svg-label plate-svg-label--bowl-sub" x="100" y="44" textAnchor="middle" pointerEvents="none">
        Tap a layer
      </text>
      <BowlSteam />
      {slotPicks &&
        LAYER_META.map(({ slot, y, h }) => {
          const lines = slotPicks[slot]
          if (!lines?.length) return null
          const mid = y + h * 0.55
          const lineGap = 7.5
          const y0 = mid - ((lines.length - 1) * lineGap) / 2
          return (
            <g key={`picks-${slot}`} clipPath={`url(#${clipId})`}>
              {lines.map((line, i) => (
                <BowlPickLine key={`${slot}-${i}`} y={y0 + i * lineGap} line={line} />
              ))}
            </g>
          )
        })}
    </svg>
  )
}
