import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgressStore } from '../store/progressStore'
import { computePersonal, currentPhase, phaseKcal, phaseKcalNote } from '../domain/personalisation'
import { TIMELINE_AFRICAN, TIMELINE_GENERAL, type TimelineEntry } from '../data/timelines'

const PLATE_TEMPLATE_HINT: Record<NonNullable<TimelineEntry['plateTemplate']>, string> = {
  rest: 'Rest day plate (veg · protein · fibre)',
  training: 'Training day plate (veg · protein · slow carbs)',
  soup: 'Soup bowl (base · protein · leafy · aromatics)',
}

type RowKind = 'meal' | 'prep' | 'supplement' | 'fast'

function rowKindForEntry(e: TimelineEntry): RowKind {
  if (e.label.toLowerCase().includes('fast')) return 'fast'
  if (e.plateTemplate || e.kcal >= 250) return 'meal'
  if (e.kcal === 0) return 'supplement'
  return 'prep'
}

function rowKindLabel(kind: RowKind): string {
  switch (kind) {
    case 'meal':
      return 'Meal'
    case 'prep':
      return 'Prep'
    case 'supplement':
      return 'Supplement'
    default:
      return 'Fast'
  }
}

function TimelineRow({ e }: { e: TimelineEntry }) {
  const [showWhy, setShowWhy] = useState(false)
  const kind = rowKindForEntry(e)
  const showKcal = e.kcal >= 150
  return (
    <div className={`timeline-row timeline-row--${e.state}${e.plateTemplate ? ' timeline-row--major' : ''}`}>
      <div className="timeline-time">{e.time}</div>
      <div className="timeline-body">
        <div className="timeline-label-row">
          <div className="timeline-label">{e.label}</div>
          <span className={`timeline-kind timeline-kind--${kind}`}>{rowKindLabel(kind)}</span>
        </div>
        <div className="timeline-detail">{e.detail}</div>
        <div className="timeline-row-meta">
          {showKcal && <div className="timeline-kcal">~{e.kcal} kcal</div>}
          <button type="button" className="timeline-why-toggle" onClick={() => setShowWhy((v) => !v)}>
            {showWhy ? 'Hide why' : 'Why'}
          </button>
        </div>
        {showWhy && <div className="timeline-mech">{e.mech}</div>}
        {e.plateTemplate && (
          <div className="timeline-plate-link">
            <Link to={`/plate?template=${e.plateTemplate}`} className="timeline-plate-link__a">
              Open plate · {PLATE_TEMPLATE_HINT[e.plateTemplate]}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export function DailyPage() {
  const baseline = useProgressStore((s) => s.baseline)
  const [tab, setTab] = useState<'general' | 'african'>('general')
  const rows = tab === 'general' ? TIMELINE_GENERAL : TIMELINE_AFRICAN

  const phase = useMemo(() => currentPhase(baseline), [baseline])
  const personal = useMemo(() => computePersonal(baseline), [baseline])
  const kcal = phaseKcal(phase, baseline)
  const kcalNote = phaseKcalNote(phase)
  const anchors = useMemo(() => {
    const open = rows.find((r) => r.state === 'fed')
    const close = [...rows].reverse().find((r) => r.label.toLowerCase().includes('fast begins'))
    const main = [...rows]
      .filter((r) => r.kcal >= 250)
      .sort((a, b) => b.kcal - a.kcal)[0]
    return { open, main, close }
  }, [rows])

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Structure</div>
          <h1>Daily plan</h1>
          <div className="topbar-sub">
            Use this as your readable day flow. Keep actions simple, then use <Link to="/today">Today</Link> to log and{' '}
            <Link to="/plate">Plate System</Link> to build meals.
          </div>
        </div>
      </div>

      {baseline?.date && (
        <div className="card daily-strip-card">
          <div className="daily-strip-title">Your protocol targets (from My Progress)</div>
          <div className="daily-strip-chips">
            <span className="chip teal">
              Phase {phase.num} · {phase.name}
            </span>
            {kcal != null && <span className="chip gold">{kcal} kcal · {kcalNote}</span>}
            {personal.protein != null && <span className="chip clay">~{personal.protein} g protein / day</span>}
          </div>
          <p className="daily-strip-note">
            Timings below are illustrative; keep protein and fibre anchors aligned with these targets. Use the Plate
            links on meal rows to open the builder with the matching template.
          </p>
        </div>
      )}

      <div className="card daily-anchors-card">
        <div className="daily-strip-title">Today&apos;s anchors</div>
        <div className="daily-strip-chips">
          {anchors.open && <span className="chip">Open: {anchors.open.time}</span>}
          {anchors.main && <span className="chip gold">Main meal: {anchors.main.time}</span>}
          {anchors.close && <span className="chip clay">Close: {anchors.close.time}</span>}
        </div>
      </div>

      <div className="sub-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'general'}
          className={tab === 'general' ? 'sub-tab active' : 'sub-tab'}
          onClick={() => setTab('general')}
        >
          General
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'african'}
          className={tab === 'african' ? 'sub-tab active' : 'sub-tab'}
          onClick={() => setTab('african')}
        >
          African emphasis
        </button>
      </div>

      <div className="card">
        <div className="timeline-list">
          {rows.map((e) => (
            <TimelineRow key={`${tab}-${e.time}-${e.label}`} e={e} />
          ))}
        </div>
      </div>
    </section>
  )
}
