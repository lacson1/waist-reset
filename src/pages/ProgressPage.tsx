import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  emptyBaseline,
  exportProgressJson,
  mergeCsvMeasurements,
  useProgressStore,
} from '../store/progressStore'
import type { Baseline, ProgressEntry } from '../types/progress'
import { computePersonal, computeTgHdl, computeWHtR } from '../domain/personalisation'
import {
  applyFullBackupDocument,
  parseFullBackupDocument,
  serializeFullBackup,
} from '../domain/appBackup'
import { parseMeasurementsCsv } from '../domain/csvImport'
import { ProgressCharts } from '../components/ProgressCharts'

const PROTOCOL_KEYS = [
  'protein',
  'fasting',
  'fibre',
  'veg',
  'steps',
  'resistance',
  'no-late',
  'sleep',
] as const

function fmt(n: number | null | undefined, d = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return (+n).toFixed(d)
}

function baselineToForm(b: Baseline | null): Baseline {
  return { ...emptyBaseline(), ...b }
}

export function ProgressPage() {
  const baseline = useProgressStore((s) => s.baseline)
  const entries = useProgressStore((s) => s.entries)
  const setBaseline = useProgressStore((s) => s.setBaseline)
  const upsertEntry = useProgressStore((s) => s.upsertEntry)
  const deleteEntry = useProgressStore((s) => s.deleteEntry)
  const resetAll = useProgressStore((s) => s.resetAll)
  const importState = useProgressStore((s) => s.importState)

  const [bForm, setBForm] = useState(() => baselineToForm(baseline))
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [eWeight, setEWeight] = useState('')
  const [eWaist, setEWaist] = useState('')
  const [eSteps, setESteps] = useState('')
  const [eTg, setETg] = useState('')
  const [eHdl, setEHdl] = useState('')
  const [eAdh, setEAdh] = useState('')
  const [eNotes, setENotes] = useState('')
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const adhOverride = useRef(false)
  const [status, setStatus] = useState<{ msg: string; kind: 'ok' | 'warn' | 'empty' } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const fullBackupRef = useRef<HTMLInputElement>(null)
  const csvRef = useRef<HTMLInputElement>(null)

  // Sync draft baseline when store baseline changes (import / clear / other tab).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync draft from persisted zustand baseline
    setBForm(baselineToForm(baseline))
  }, [baseline])

  const personal = useMemo(() => computePersonal(bForm), [bForm])

  const labSnapshotRows = useMemo(() => {
    const filtered = [...entries]
      .filter((e) => e.tg != null || e.hdl != null)
      .sort((a, b) => b.date.localeCompare(a.date))
    return filtered.slice(0, 12).map((e, idx) => {
      const ratio = computeTgHdl(e.tg, e.hdl)
      const older = filtered[idx + 1]
      const olderRatio = older ? computeTgHdl(older.tg, older.hdl) : null
      const deltaRatio = ratio != null && olderRatio != null ? ratio - olderRatio : null
      return { date: e.date, tg: e.tg, hdl: e.hdl, ratio, deltaRatio }
    })
  }, [entries])

  const showStatus = useCallback((msg: string, kind: 'ok' | 'warn' | 'empty') => {
    setStatus({ msg, kind })
    setTimeout(() => setStatus((s) => (s?.msg === msg ? null : s)), 4000)
  }, [])

  const saveBaselineClick = () => {
    setBaseline(bForm)
    showStatus('Baseline saved. Personalisation computed — check Today tab.', 'ok')
  }

  const clearBaselineClick = () => {
    if (!window.confirm('Clear baseline? (Your daily entries will be kept.)')) return
    setBaseline(null)
    setBForm(emptyBaseline())
    showStatus('Baseline cleared.', 'warn')
  }

  const updateCheckAdherence = (next: Record<string, boolean>) => {
    const n = PROTOCOL_KEYS.length
    const checked = PROTOCOL_KEYS.filter((k) => next[k]).length
    const pct = n ? Math.round((checked / n) * 100) : 0
    if (!adhOverride.current) setEAdh(String(pct))
    setChecks(next)
  }

  const saveEntryClick = () => {
    const num = (s: string) => (s === '' || Number.isNaN(parseFloat(s)) ? null : parseFloat(s))
    const date = entryDate
    if (!date) {
      window.alert('Please pick a date.')
      return
    }
    const stepsRaw = num(eSteps)
    const entry: ProgressEntry = {
      date,
      weight: num(eWeight),
      waist: num(eWaist),
      steps: stepsRaw == null ? null : Math.round(stepsRaw),
      tg: num(eTg),
      hdl: num(eHdl),
      adherence: eAdh === '' ? null : parseFloat(eAdh),
      notes: eNotes,
    }
    if (
      entry.weight == null &&
      entry.waist == null &&
      entry.steps == null &&
      entry.tg == null &&
      entry.hdl == null &&
      entry.adherence == null
    ) {
      window.alert('Please enter at least one measurement.')
      return
    }
    const ok = upsertEntry(entry, false)
    if (!ok) {
      if (!window.confirm(`An entry for ${date} exists. Replace it?`)) return
      upsertEntry(entry, true)
    }
    setEWeight('')
    setEWaist('')
    setESteps('')
    setETg('')
    setEHdl('')
    setEAdh('')
    setENotes('')
    setChecks({})
    adhOverride.current = false
    setEntryDate(new Date().toISOString().slice(0, 10))
    showStatus(`Entry saved for ${date}.`, 'ok')
  }

  const clearEntryForm = () => {
    setEWeight('')
    setEWaist('')
    setESteps('')
    setETg('')
    setEHdl('')
    setEAdh('')
    setENotes('')
    setChecks({})
    adhOverride.current = false
    setEntryDate(new Date().toISOString().slice(0, 10))
  }

  const exportJson = () => {
    const blob = new Blob([exportProgressJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vat-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImportFile: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (!data || !Array.isArray(data.entries)) throw new Error('Invalid file')
        if (!window.confirm('Import will replace your current data. Continue?')) return
        importState(data)
        setBForm(baselineToForm(data.baseline))
        showStatus(`Imported ${data.entries.length} entries.`, 'ok')
      } catch (err) {
        window.alert(`Could not import file: ${(err as Error).message}`)
      }
    }
    reader.readAsText(file)
    ev.target.value = ''
  }

  const exportFullBackupClick = () => {
    const blob = new Blob([serializeFullBackup()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waist-reset-full-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showStatus('Full backup downloaded (OpenAI key redacted).', 'ok')
  }

  const onImportFullBackup: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const doc = parseFullBackupDocument(String(reader.result))
        if (
          !window.confirm(
            'Restore full backup? This overwrites progress, saved meals, plate builder, food prefs, reviews, and related data in this browser. The page will reload.',
          )
        )
          return
        applyFullBackupDocument(doc)
        window.location.reload()
      } catch (err) {
        window.alert(`Could not restore backup: ${(err as Error).message}`)
      }
    }
    reader.readAsText(file)
    ev.target.value = ''
  }

  const onImportCsv: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const { rows, errors } = parseMeasurementsCsv(String(reader.result))
        if (rows.length === 0) {
          window.alert(errors.length ? errors.slice(0, 10).join('\n') : 'No rows to import.')
          return
        }
        mergeCsvMeasurements(rows)
        const note = errors.length ? ` (${errors.length} parse note${errors.length === 1 ? '' : 's'})` : ''
        showStatus(`Merged ${rows.length} CSV row(s) into your log.${note}`, errors.length ? 'warn' : 'ok')
      } catch (err) {
        window.alert(`CSV import failed: ${(err as Error).message}`)
      }
    }
    reader.readAsText(file)
    ev.target.value = ''
  }

  const latest = entries.length ? entries[entries.length - 1] : null
  const latestWaist = latest?.waist ?? null
  const latestWeight = latest?.weight ?? null
  const latestTg = [...entries].reverse().find((e) => e.tg != null)
  const latestHdl = [...entries].reverse().find((e) => e.hdl != null)
  const b = baseline

  const tgVal = latestTg?.tg ?? b?.tg
  const hdlVal = latestHdl?.hdl ?? b?.hdl
  const ratio = computeTgHdl(tgVal ?? null, hdlVal ?? null)

  const adhVals = entries.map((e) => e.adherence).filter((v): v is number => v != null)
  const adhAvg = adhVals.length ? adhVals.reduce((a, x) => a + x, 0) / adhVals.length : null

  let days = 0
  if (b?.date) {
    const start = new Date(b.date)
    days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000))
  }

  const savedLabel =
    !b?.date && entries.length === 0
      ? 'No data saved yet'
      : `Saved ✓ ${b?.date ? 'baseline' : 'no baseline'} · ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} · ${new Date().toLocaleString()}`

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Measure &amp; Track</div>
          <h1>My Progress</h1>
          <div className="topbar-sub">
            Log measurements over time. Data stays in this browser unless you export a backup.
          </div>
        </div>
        <div className="topbar-right">
          <span className="chip teal">{days} days since baseline</span>
          <span className="chip gold">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {status && (
        <div className={`tracker-status-wrap ${status.kind === 'warn' ? 'warn' : status.kind === 'empty' ? 'empty' : ''}`}>
          <div className="tracker-status">{status.msg}</div>
        </div>
      )}

      {!baseline && entries.length === 0 && (
        <div className="tracker-status empty">
          Welcome — start by saving your <strong>baseline</strong> on the left, then log your first measurement
          on the right.
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi teal">
          <div className="kpi-label">Current Waist</div>
          <div className="kpi-value">{latestWaist != null ? `${fmt(latestWaist, 1)} cm` : b?.waist != null ? `${fmt(b.waist, 1)} cm` : '—'}</div>
          <div className="kpi-sub">
            {b?.waist != null && latestWaist != null
              ? `${latestWaist - b.waist < 0 ? '' : '+'}${fmt(latestWaist - b.waist, 1)} cm vs baseline${b.targetWaist ? ` · target ${b.targetWaist} cm` : ''}`
              : b?.targetWaist && b?.waist
                ? `Target ${b.targetWaist} cm · need ${fmt(b.waist - b.targetWaist, 1)} cm more`
                : 'Set a baseline to track'}
          </div>
        </div>
        <div className="kpi clay">
          <div className="kpi-label">Current Weight</div>
          <div className="kpi-value">{latestWeight != null ? `${fmt(latestWeight, 1)} kg` : b?.weight != null ? `${fmt(b.weight, 1)} kg` : '—'}</div>
          <div className="kpi-sub">
            {b?.weight != null && latestWeight != null
              ? `${latestWeight - b.weight < 0 ? '' : '+'}${fmt(latestWeight - b.weight, 1)} kg vs baseline${b.targetWeight ? ` · target ${b.targetWeight} kg` : ''}`
              : 'Set a baseline to track'}
          </div>
        </div>
        <div className="kpi gold">
          <div className="kpi-label">TG:HDL Ratio</div>
          <div className="kpi-value">{ratio != null ? fmt(ratio, 2) : '—'}</div>
          <div className="kpi-sub">
            {ratio != null
              ? ratio < 1.5
                ? 'Optimal metabolic health'
                : ratio < 2
                  ? 'Good — at target'
                  : ratio < 3.5
                    ? 'Elevated VAT risk — keep working'
                    : 'High VAT risk — priority biomarker'
              : 'Target < 2.0 (optimal < 1.5)'}
          </div>
        </div>
        <div className="kpi plum">
          <div className="kpi-label">Avg Adherence</div>
          <div className="kpi-value">{adhAvg != null ? `${fmt(adhAvg, 0)}%` : '—'}</div>
          <div className="kpi-sub">
            {adhAvg != null
              ? adhAvg >= 85
                ? 'On track — results compound here'
                : adhAvg >= 70
                  ? 'Decent — push for 85%+'
                  : 'Slipping — audit triggers this week'
              : 'Protocol consistency'}
          </div>
        </div>
      </div>

      <div className="tracker-grid">
        <div className="form-card accent-teal">
          <h3>① Baseline &amp; Personalisation</h3>
          <div className="form-sub">Set once. Powers calorie target, protein, and coach recommendations.</div>
          <div className="input-row">
            <div className="field">
              <label htmlFor="b-date">Start Date</label>
              <input type="date" id="b-date" value={bForm.date || ''} onChange={(e) => setBForm((p) => ({ ...p, date: e.target.value || null }))} />
            </div>
            <div className="field">
              <label htmlFor="b-sex">Sex (biological)</label>
              <select id="b-sex" value={bForm.sex || ''} onChange={(e) => setBForm((p) => ({ ...p, sex: e.target.value || null }))}>
                <option value="">—</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              <div className="hint">For BMR + risk thresholds</div>
            </div>
            <div className="field">
              <label htmlFor="b-age">Age (years)</label>
              <input id="b-age" type="number" step={1} min={16} max={100} placeholder="e.g. 38" value={bForm.age ?? ''} onChange={(e) => setBForm((p) => ({ ...p, age: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
          </div>
          <div className="input-row">
            <div className="field">
              <label htmlFor="b-weight">Starting Weight (kg)</label>
              <input id="b-weight" type="number" step={0.1} min={30} max={300} placeholder="e.g. 92.5" value={bForm.weight ?? ''} onChange={(e) => setBForm((p) => ({ ...p, weight: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label htmlFor="b-height">Height (cm)</label>
              <input id="b-height" type="number" step={0.1} min={100} max={230} placeholder="e.g. 178" value={bForm.height ?? ''} onChange={(e) => setBForm((p) => ({ ...p, height: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label htmlFor="b-activity">Activity Level</label>
              <select id="b-activity" value={bForm.activity || ''} onChange={(e) => setBForm((p) => ({ ...p, activity: e.target.value || null }))}>
                <option value="">—</option>
                <option value="1.2">Sedentary · desk + no ex</option>
                <option value="1.375">Light · 1–3 d/wk</option>
                <option value="1.55">Moderate · 3–5 d/wk</option>
                <option value="1.725">Active · 6–7 d/wk</option>
                <option value="1.9">Very active · 2×/day</option>
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="field">
              <label htmlFor="b-waist">Starting Waist (cm)</label>
              <input id="b-waist" type="number" step={0.1} min={40} max={200} placeholder="e.g. 104" value={bForm.waist ?? ''} onChange={(e) => setBForm((p) => ({ ...p, waist: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
              <div className="hint">Navel, exhale, first thing in morning</div>
            </div>
            <div className="field">
              <label htmlFor="b-tg">Starting Triglycerides (mg/dL)</label>
              <input id="b-tg" type="number" step={1} min={20} max={1000} placeholder="e.g. 165" value={bForm.tg ?? ''} onChange={(e) => setBForm((p) => ({ ...p, tg: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label htmlFor="b-hdl">Starting HDL (mg/dL)</label>
              <input id="b-hdl" type="number" step={1} min={10} max={150} placeholder="e.g. 42" value={bForm.hdl ?? ''} onChange={(e) => setBForm((p) => ({ ...p, hdl: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
          </div>
          <div className="input-row">
            <div className="field">
              <label htmlFor="b-glucose">Fasting Glucose (mg/dL) <em className="label-soft">optional</em></label>
              <input id="b-glucose" type="number" step={1} min={40} max={400} placeholder="e.g. 98" value={bForm.glucose ?? ''} onChange={(e) => setBForm((p) => ({ ...p, glucose: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label htmlFor="b-hscrp">hs-CRP (mg/L) <em className="label-soft">optional</em></label>
              <input id="b-hscrp" type="number" step={0.1} min={0} max={30} placeholder="e.g. 1.8" value={bForm.hscrp ?? ''} onChange={(e) => setBForm((p) => ({ ...p, hscrp: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
          </div>
          <div className="input-row">
            <div className="field">
              <label htmlFor="t-waist">Target Waist (cm)</label>
              <input id="t-waist" type="number" step={0.1} min={40} max={200} placeholder="e.g. 90" value={bForm.targetWaist ?? ''} onChange={(e) => setBForm((p) => ({ ...p, targetWaist: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label htmlFor="t-weight">Target Weight (kg)</label>
              <input id="t-weight" type="number" step={0.1} min={30} max={300} placeholder="e.g. 80" value={bForm.targetWeight ?? ''} onChange={(e) => setBForm((p) => ({ ...p, targetWeight: e.target.value === '' ? null : parseFloat(e.target.value) }))} />
            </div>
          </div>

          {personal.tdee != null && (
            <div className="personal-readout">
              <div className="pr-label">Your personalised prescription</div>
              <div className="pr-grid">
                <div>
                  <span className="pr-k">BMR</span>
                  <span className="pr-v">{Math.round(personal.bmr!)} kcal</span>
                </div>
                <div>
                  <span className="pr-k">TDEE</span>
                  <span className="pr-v">{Math.round(personal.tdee!)} kcal</span>
                </div>
                <div>
                  <span className="pr-k">Protein</span>
                  <span className="pr-v">{personal.protein ?? '—'} g</span>
                </div>
                <div>
                  <span className="pr-k">Phase 1 kcal</span>
                  <span className="pr-v">{personal.p1 ?? '—'} kcal</span>
                </div>
                <div>
                  <span className="pr-k">Phase 2 kcal</span>
                  <span className="pr-v">{personal.p2 ?? '—'} kcal</span>
                </div>
                <div>
                  <span className="pr-k">Phase 3 kcal</span>
                  <span className="pr-v">{personal.p3 ?? '—'} kcal</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-sm" id="save-baseline" onClick={saveBaselineClick}>
              Save Baseline
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={clearBaselineClick}>
              Clear
            </button>
          </div>
        </div>

        <div className="form-card accent-clay">
          <h3>② Log Today&apos;s Measurement</h3>
          <div className="form-sub">Weight + waist daily. Ticks set adherence automatically unless you override.</div>
          <div className="input-row">
            <div className="field">
              <label htmlFor="e-date">Date</label>
              <input id="e-date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="e-weight">Weight (kg)</label>
              <input id="e-weight" type="number" step={0.1} value={eWeight} onChange={(e) => setEWeight(e.target.value)} placeholder="e.g. 89.2" />
            </div>
            <div className="field">
              <label htmlFor="e-waist">Waist (cm)</label>
              <input id="e-waist" type="number" step={0.1} value={eWaist} onChange={(e) => setEWaist(e.target.value)} placeholder="e.g. 101.5" />
            </div>
          </div>
          <div className="input-row">
            <div className="field">
              <label htmlFor="e-steps">Steps (optional)</label>
              <input
                id="e-steps"
                type="number"
                step={1}
                min={0}
                value={eSteps}
                onChange={(e) => setESteps(e.target.value)}
                placeholder="e.g. 8420 · or import CSV"
              />
            </div>
          </div>

          <div className="checklist-wrap">
            <div className="checklist-label">
              Today&apos;s protocol components{' '}
              <span>
                (
                {PROTOCOL_KEYS.filter((k) => checks[k]).length}/{PROTOCOL_KEYS.length})
              </span>
            </div>
            <div className="checklist" id="protocol-checklist">
              {[
                ['protein', 'Protein first at every meal'],
                ['fasting', '≥14h fasting window held'],
                ['fibre', 'Psyllium/fibre × 2 doses'],
                ['veg', '≥400g vegetables'],
                ['steps', '≥8,000 steps'],
                ['resistance', 'Resistance training (or rest day)'],
                ['no-late', 'No eating after 19:00'],
                ['sleep', '≥7h sleep last night'],
              ].map(([key, label]) => (
                <label key={key} className="check-item">
                  <input
                    type="checkbox"
                    checked={!!checks[key]}
                    onChange={(e) => {
                      const next = { ...checks, [key]: e.target.checked }
                      updateCheckAdherence(next)
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="input-row" style={{ marginTop: 10 }}>
            <div className="field">
              <label htmlFor="e-adh">Adherence (%) auto</label>
              <input
                id="e-adh"
                type="number"
                step={1}
                min={0}
                max={100}
                placeholder="Ticks above"
                value={eAdh}
                onChange={(e) => {
                  adhOverride.current = true
                  setEAdh(e.target.value)
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="e-tg">Triglycerides (optional)</label>
              <input id="e-tg" type="number" value={eTg} onChange={(e) => setETg(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="e-hdl">HDL (optional)</label>
              <input id="e-hdl" type="number" value={eHdl} onChange={(e) => setEHdl(e.target.value)} />
            </div>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label htmlFor="e-notes">Notes</label>
            <textarea id="e-notes" value={eNotes} onChange={(e) => setENotes(e.target.value)} placeholder="Energy, sleep, cravings…" rows={3} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-sm" onClick={saveEntryClick}>
              Save Entry
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={clearEntryForm}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <ProgressCharts baseline={baseline} entries={entries} />

      {labSnapshotRows.length > 0 && (
        <div className="card lab-snap-card">
          <div className="section-title">Lab snapshots from your log</div>
          <p className="lab-snap-lead">
            TG and HDL saved on measurement rows (retest days). <strong>Coach</strong> uses the latest pair here or on
            baseline when logs are empty. Δ ratio vs your previous logged pair.
          </p>
          <div className="table-scroll">
            <table className="data-table lab-snap-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>TG</th>
                  <th>HDL</th>
                  <th>TG:HDL</th>
                  <th>Δ vs prior log</th>
                </tr>
              </thead>
              <tbody>
                {labSnapshotRows.map((row) => (
                  <tr key={row.date}>
                    <td>
                      <strong>{row.date}</strong>
                    </td>
                    <td>{row.tg ?? '—'}</td>
                    <td>{row.hdl ?? '—'}</td>
                    <td>{row.ratio != null ? fmt(row.ratio, 2) : '—'}</td>
                    <td>
                      {row.deltaRatio == null
                        ? '—'
                        : `${row.deltaRatio > 0 ? '+' : ''}${fmt(row.deltaRatio, 2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <div className="log-header">
          <div>
            <div className="section-title">Measurement Log</div>
            <div className="section-h" style={{ marginBottom: 0 }}>
              History
            </div>
            <div className={`saved-indicator ${!b?.date && entries.length === 0 ? 'empty' : 'ok'}`}>{savedLabel}</div>
          </div>
          <div className="log-actions">
            <button type="button" className="btn btn-sm" onClick={exportJson}>
              ⬇ Progress JSON
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => fileRef.current?.click()}>
              Restore progress JSON
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden-file" onChange={onImportFile} />
            <button type="button" className="btn btn-sm" onClick={exportFullBackupClick}>
              ⬇ Full app backup
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => fullBackupRef.current?.click()}>
              Restore full backup
            </button>
            <input
              ref={fullBackupRef}
              type="file"
              accept=".json,application/json"
              className="hidden-file"
              onChange={onImportFullBackup}
            />
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => csvRef.current?.click()}>
              Import CSV (weight/steps)
            </button>
            <input ref={csvRef} type="file" accept=".csv,text/csv" className="hidden-file" onChange={onImportCsv} />
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => {
                if (!window.confirm('Delete ALL progress data?')) return
                if (!window.confirm('Are you absolutely sure?')) return
                resetAll()
                setBForm(emptyBaseline())
                showStatus('All progress data has been cleared.', 'warn')
              }}
            >
              Reset All Data
            </button>
          </div>
        </div>
        <div className="storage-note">
          Data stays in this browser. <b>Progress JSON</b> is baseline + entries only (legacy-compatible).{' '}
          <b>Full app backup</b> includes meals, plate builder, food prefs, weekly reviews, and your custom foods;
          OpenAI keys are stripped from exports. <b>CSV import</b> merges rows by date (columns like{' '}
          <code>date</code>, <code>weight</code>, <code>steps</code>).
        </div>
        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div>No entries yet. Log your first measurement above.</div>
          </div>
        ) : (
          <div className="log-table-wrap">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Waist</th>
                  <th>Steps</th>
                  <th>WHtR</th>
                  <th>TG</th>
                  <th>HDL</th>
                  <th>TG:HDL</th>
                  <th>Adh.</th>
                  <th>Notes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {[...entries].reverse().map((e) => {
                  const whtr = computeWHtR(e.waist, b?.height ?? null)
                  const tgh = computeTgHdl(e.tg, e.hdl)
                  return (
                    <tr key={e.date}>
                      <td>
                        <strong>{e.date}</strong>
                      </td>
                      <td>{e.weight != null ? fmt(e.weight, 1) : '—'}</td>
                      <td>{e.waist != null ? fmt(e.waist, 1) : '—'}</td>
                      <td>{e.steps != null ? String(Math.round(e.steps)) : '—'}</td>
                      <td>{whtr != null ? fmt(whtr, 2) : '—'}</td>
                      <td>{e.tg ?? '—'}</td>
                      <td>{e.hdl ?? '—'}</td>
                      <td>{tgh != null ? fmt(tgh, 2) : '—'}</td>
                      <td>{e.adherence != null ? `${e.adherence}%` : '—'}</td>
                      <td className="cell-notes">{e.notes}</td>
                      <td>
                        <button type="button" className="del-btn" onClick={() => {
                          if (window.confirm(`Delete entry for ${e.date}?`)) deleteEntry(e.date)
                        }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
