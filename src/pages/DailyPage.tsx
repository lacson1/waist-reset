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

function TimelineRow({ e }: { e: TimelineEntry }) {
  return (
    <div className={`timeline-row timeline-row--${e.state}`}>
      <div className="timeline-time">{e.time}</div>
      <div className="timeline-body">
        <div className="timeline-label">{e.label}</div>
        <div className="timeline-detail">{e.detail}</div>
        <div className="timeline-mech">{e.mech}</div>
        {e.kcal > 0 && <div className="timeline-kcal">~{e.kcal} kcal</div>}
        {e.plateTemplate && (
          <div className="timeline-plate-link">
            <Link to={`/plate?template=${e.plateTemplate}`} className="timeline-plate-link__a">
              Plate builder · {PLATE_TEMPLATE_HINT[e.plateTemplate]}
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

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Structure</div>
          <h1>Daily plan</h1>
          <div className="topbar-sub">
            Example eating windows and anchors for General Mediterranean vs African-Mediterranean emphasis. Pair with{' '}
            <Link to="/today">Today</Link> for your checklist and{' '}
            <Link to="/plate">Plate System</Link> to model each main eating block.
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
