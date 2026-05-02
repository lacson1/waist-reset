import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TIMELINE_AFRICAN, TIMELINE_GENERAL, type TimelineEntry } from '../data/timelines'

function TimelineRow({ e }: { e: TimelineEntry }) {
  return (
    <div className={`timeline-row timeline-row--${e.state}`}>
      <div className="timeline-time">{e.time}</div>
      <div className="timeline-body">
        <div className="timeline-label">{e.label}</div>
        <div className="timeline-detail">{e.detail}</div>
        <div className="timeline-mech">{e.mech}</div>
        {e.kcal > 0 && <div className="timeline-kcal">~{e.kcal} kcal</div>}
      </div>
    </div>
  )
}

export function DailyPage() {
  const [tab, setTab] = useState<'general' | 'african'>('general')
  const rows = tab === 'general' ? TIMELINE_GENERAL : TIMELINE_AFRICAN

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Structure</div>
          <h1>Daily plan</h1>
          <div className="topbar-sub">
            Example eating windows and anchors for General Mediterranean vs African-Mediterranean emphasis. Pair with{' '}
            <Link to="/today">Today</Link> for your checklist.
          </div>
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
