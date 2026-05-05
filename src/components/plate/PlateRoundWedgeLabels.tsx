import type { PlatePickLine } from '../../domain/plateMeal'
import type { FoodTypeKind } from './foodTypeMeta'
import { foodTypeKind } from './foodTypeMeta'
import { FoodTypeGlyph } from './FoodTypeIcon'
import { wrapPlatePickLabel } from './platePickLabelWrap'

/** Icon left of text; column nudged inward (less negative) so lines stay inside curved wedge clips. */
const PICK_ICON_X = -26
const PICK_ICON_W = 6.5
const PICK_ICON_GAP = 3.25
const PICK_ICON_BASELINE_NUDGE = 5.75
const PICK_HALO_R = 5.35

const GAP_MIN = 1.35
const GAP_MAX = 7.25

/** "½ Veg" → two lines so the fraction reads apart from the wedge name (imprint clarity). */
function splitWedgeTitle(title: string): { frac: string; name: string | null } {
  const t = title.trim()
  const i = t.indexOf(' ')
  if (i <= 0 || i >= t.length - 1) return { frac: t, name: null }
  return { frac: t.slice(0, i).trim(), name: t.slice(i + 1).trim() || null }
}

/**
 * Bottom baseline cap for the last food line in this wedge (user units).
 * Upper-left quarter (fibre / carbs): was 93 while `firstPickY` sits ~97+, so vertical
 * budget went negative and picks overlapped. Allow a taller band; parent clipPath still
 * trims anything outside the wedge.
 */
function pickRegionBottom(cx: number, titleY: number): number {
  if (cx < 90 && titleY < 82) return 112
  if (cx < 90) return 179
  return 181
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

/**
 * Fit wrapped food lines into [firstY, regionBottom]: start at top of wedge body (below title),
 * shrink line step + gaps until everything fits when many picks / wraps.
 */
function fitPickColumn(
  wrapped: string[][],
  firstY: number,
  regionBottom: number,
): { tspanDy: number; baselines: number[] } {
  const n = wrapped.length
  if (n === 0) {
    return { tspanDy: 6.2, baselines: [] }
  }

  let tspanDy = 6.35
  let blockBase = 6.55

  for (let iter = 0; iter < 12; iter++) {
    const blockHeights = wrapped.map((w) => (w.length - 1) * tspanDy + blockBase)
    const sumH = blockHeights.reduce((a, h) => a + h, 0)
    const slack = regionBottom - firstY - sumH
    if (slack >= 0 && n === 1) {
      return { tspanDy, baselines: [firstY] }
    }
    if (n > 1) {
      const gap = clamp(slack / (n - 1), GAP_MIN, GAP_MAX)
      const used = sumH + (n - 1) * gap
      if (firstY + used <= regionBottom + 0.75) {
        const baselines: number[] = []
        let y = firstY
        for (let i = 0; i < n; i++) {
          baselines.push(y)
          y += blockHeights[i] + (i < n - 1 ? gap : 0)
        }
        return { tspanDy, baselines }
      }
    } else if (n === 1 && firstY + sumH <= regionBottom + 0.75) {
      return { tspanDy, baselines: [firstY] }
    }

    tspanDy *= 0.93
    blockBase *= 0.93
    if (tspanDy < 3.55) break
  }

  const blockHeights = wrapped.map((w) => (w.length - 1) * tspanDy + blockBase)
  const sumH = blockHeights.reduce((a, h) => a + h, 0)
  const gap = n > 1 ? Math.max(GAP_MIN, (regionBottom - firstY - sumH) / (n - 1)) : 0
  const baselines: number[] = []
  let y = firstY
  for (let i = 0; i < n; i++) {
    baselines.push(y)
    y += blockHeights[i] + (i < n - 1 ? gap : 0)
  }
  return { tspanDy, baselines }
}

type Props = {
  cx: number
  titleY: number
  title: string
  lines?: readonly PlatePickLine[]
  titleClassName?: string
  /** Nudge ½ / ¼ labels toward the plate hub (frees the outer wedge band for food text). */
  titleTransform?: string
  /** Nudge food column toward the outer rim / wide part of the wedge. */
  picksTransform?: string
  /** Extra space (user units) between title well bottom and first food baseline. */
  picksLeadGap?: number
}

/**
 * Wedge title sits nearer the hub; food lines sit in a separate band pushed outward with
 * `picksTransform` + `picksLeadGap` so the middle of the wedge reads as “foods”, not labels.
 */
export function PlateRoundWedgeLabels({
  cx,
  titleY,
  title,
  lines,
  titleClassName = 'plate-svg-label plate-svg-label--imprint',
  titleTransform = '',
  picksTransform = '',
  picksLeadGap = 0,
}: Props) {
  const { frac, name } = splitWedgeTitle(title)
  const twoLine = name != null
  const titleWellY = titleY - 11
  const titleWellH = twoLine ? 22 : 12
  /* Narrower well on left wedges so the pill stays left of x≈100 (centre seam). */
  const titleWellW = cx < 90 ? 54 : 60
  const titleWellX = cx - titleWellW / 2
  /** Greedy wrap width per line (wider on outer wedges; still inside arc clip). */
  const pickMaxChars = cx < 90 ? 10 : 16

  const firstPickY = titleWellY + titleWellH + 3 + picksLeadGap
  const bottomY = pickRegionBottom(cx, titleY)

  const wrappedBlocks =
    lines?.map((line) => wrapPlatePickLabel(line.label, pickMaxChars)) ?? []
  const { tspanDy, baselines } = fitPickColumn(wrappedBlocks, firstPickY, bottomY)

  const titleGProps =
    titleTransform && titleTransform.length > 0 ? { transform: titleTransform } : {}
  const picksGProps =
    picksTransform && picksTransform.length > 0 ? { transform: picksTransform } : {}

  return (
    <g pointerEvents="none">
      <g {...titleGProps}>
        <rect
          className="plate-svg-wedge-title-well"
          x={titleWellX}
          y={titleWellY}
          width={titleWellW}
          height={titleWellH}
          rx={8}
          ry={8}
        />
        <text
          className={`plate-svg-wedge-title ${titleClassName}`}
          x={cx}
          y={titleY}
          textAnchor="middle"
        >
          <tspan className="plate-svg-wedge-title__frac">{frac}</tspan>
          {name != null ? (
            <tspan className="plate-svg-wedge-title__name" x={cx} dy="10">
              {name}
            </tspan>
          ) : null}
        </text>
      </g>
      {lines?.length ? (
        <g {...picksGProps}>
          {lines.map((line, i) => {
            const wrapped = wrappedBlocks[i]!
            const y = baselines[i]!
            const kind: FoodTypeKind | null = line.type ? foodTypeKind(line.type) : null
            const isOverflowLine = /^\+\d+\s+more$/i.test(line.label.trim())
            const textX = cx + PICK_ICON_X + PICK_ICON_W + PICK_ICON_GAP
            const iconYOffset =
              wrapped.length > 1 ? ((wrapped.length - 1) * tspanDy) / 2 : 0
            const iconCx = cx + PICK_ICON_X + PICK_ICON_W / 2
            const iconCy =
              y - PICK_ICON_BASELINE_NUDGE + PICK_ICON_W / 2 + iconYOffset
            return (
              <g key={`${line.label}-${i}`}>
                {kind != null && (
                  <>
                    <circle
                      className="plate-svg-pick-halo"
                      data-kind={kind}
                      cx={iconCx}
                      cy={iconCy}
                      r={PICK_HALO_R}
                    />
                    <svg
                      x={cx + PICK_ICON_X}
                      y={y - PICK_ICON_BASELINE_NUDGE + iconYOffset}
                      width={PICK_ICON_W}
                      height={PICK_ICON_W}
                      viewBox="0 0 24 24"
                      className="plate-svg-pick-icon"
                      data-kind={kind}
                    >
                      <FoodTypeGlyph kind={kind} />
                    </svg>
                  </>
                )}
                <text
                  className={`plate-svg-pick plate-svg-pick--imprint${isOverflowLine ? ' plate-svg-pick--overflow' : ''}`}
                  x={kind != null ? textX : cx}
                  y={y}
                  textAnchor={kind != null ? 'start' : 'middle'}
                >
                  <title>{line.label}</title>
                  {wrapped.map((ln, li) => (
                    <tspan key={`${i}-${li}`} x={kind != null ? textX : cx} dy={li === 0 ? 0 : tspanDy}>
                      {ln}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
        </g>
      ) : null}
    </g>
  )
}
