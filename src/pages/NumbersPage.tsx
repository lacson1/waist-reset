import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  calculateYourNumbers,
  type NumbersInput,
  type NumbersPhase,
  type NumbersSex,
} from '../domain/yourNumbers'
import { useProgressStore } from '../store/progressStore'
import type { Baseline } from '../types/progress'

const ACT_OPTS = [
  { v: 1.2, l: 'Sedentary (desk)' },
  { v: 1.375, l: 'Light (1–3× training)' },
  { v: 1.55, l: 'Moderate (3–5×)' },
  { v: 1.725, l: 'Active (6–7×)' },
  { v: 1.9, l: 'Very active / physical job' },
]

function baselineToNumbersInput(baseline: Baseline | null): Partial<NumbersInput> {
  if (!baseline) return {}
  const sex: NumbersSex | undefined =
    baseline.sex === 'M' ? 'm' : baseline.sex === 'F' ? 'f' : undefined
  const act = baseline.activity ? parseFloat(baseline.activity) : undefined
  return {
    sex,
    age: baseline.age ?? undefined,
    heightCm: baseline.height ?? undefined,
    weightKg: baseline.weight ?? undefined,
    waistCm: baseline.waist ?? undefined,
    activity: act && !Number.isNaN(act) ? act : undefined,
  }
}

export function NumbersPage() {
  const baseline = useProgressStore((s) => s.baseline)

  const [sex, setSex] = useState<NumbersSex>('m')
  const [age, setAge] = useState('40')
  const [heightCm, setHeightCm] = useState('175')
  const [weightKg, setWeightKg] = useState('85')
  const [waistCm, setWaistCm] = useState('98')
  const [activity, setActivity] = useState(1.375)
  const [phase, setPhase] = useState<NumbersPhase>('cut')

  const pullBaseline = () => {
    const p = baselineToNumbersInput(baseline)
    if (p.sex) setSex(p.sex)
    if (p.age != null) setAge(String(p.age))
    if (p.heightCm != null) setHeightCm(String(p.heightCm))
    if (p.weightKg != null) setWeightKg(String(p.weightKg))
    if (p.waistCm != null) setWaistCm(String(p.waistCm))
    if (p.activity != null) setActivity(p.activity)
  }

  const result = useMemo(() => {
    const ageN = parseFloat(age)
    const ht = parseFloat(heightCm)
    const wt = parseFloat(weightKg)
    const wst = parseFloat(waistCm)
    if ([ageN, ht, wt, wst, activity].some((x) => Number.isNaN(x) || x <= 0)) return null
    return calculateYourNumbers({
      sex,
      age: ageN,
      heightCm: ht,
      weightKg: wt,
      waistCm: wst,
      activity,
      phase,
    })
  }, [sex, age, heightCm, weightKg, waistCm, activity, phase])

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Personalisation</div>
          <h1>Your numbers</h1>
          <div className="topbar-sub">
            Mifflin–St Jeor TDEE, deficit band, protein range, WHtR, and carb cycling placeholders from the
            original calculator. Save baseline on <Link to="/progress">My Progress</Link> for Coach and Today.
          </div>
        </div>
        <div className="topbar-right">
          <button type="button" className="btn btn-ghost" onClick={pullBaseline} disabled={!baseline}>
            Pull from My Progress baseline
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="section-h section-h--flush">Inputs</h2>
        <div className="form-grid-2">
          <div className="field">
            <label htmlFor="num-sex">Sex</label>
            <select id="num-sex" value={sex} onChange={(e) => setSex(e.target.value as NumbersSex)}>
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="num-age">Age</label>
            <input id="num-age" type="number" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="num-ht">Height (cm)</label>
            <input id="num-ht" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="num-wt">Weight (kg)</label>
            <input id="num-wt" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="num-waist">Waist (cm)</label>
            <input id="num-waist" type="number" value={waistCm} onChange={(e) => setWaistCm(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="num-act">Activity</label>
            <select
              id="num-act"
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
            >
              {ACT_OPTS.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
          </div>
          <div className="field field-span-2">
            <label htmlFor="num-phase">Phase</label>
            <select id="num-phase" value={phase} onChange={(e) => setPhase(e.target.value as NumbersPhase)}>
              <option value="cut">Cut (15–25% deficit)</option>
              <option value="break">Diet break (maintenance)</option>
              <option value="maintain">Maintain</option>
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="card">
          <h2 className="section-h section-h--flush">Results</h2>
          <div className="kpi-grid">
            <div className="kpi">
              <div className="kpi-label">TDEE</div>
              <div className="kpi-value">{result.tdee} kcal</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Deficit target</div>
              <div className="kpi-value">
                {result.kcalLow}–{result.kcalHigh}
              </div>
              <div className="kpi-sub">{result.deficitLabel}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Protein (g/day)</div>
              <div className="kpi-value">
                {result.proteinLow}–{result.proteinHigh}
              </div>
            </div>
            <div className="kpi">
              <div className="kpi-label">WHtR</div>
              <div className="kpi-value">{result.whtr}</div>
              <div className="kpi-sub">Target waist ≈ {result.waistTarget} cm</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">BMI</div>
              <div className="kpi-value">{result.bmi.toFixed(1)}</div>
              <div className="kpi-sub">{result.bmiCat}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Carb (train / rest g)</div>
              <div className="kpi-value">
                {result.carbTrain} / {result.carbRest}
              </div>
              <div className="kpi-sub">Fat fill ≈ {result.fatGrams} g (mid kcal)</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
