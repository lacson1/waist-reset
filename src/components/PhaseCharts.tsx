import { useEffect, useRef } from 'react'
import { Chart, type ChartDataset } from 'chart.js'
import type { Baseline } from '../types/progress'
import { computePersonal, phaseKcal } from '../domain/personalisation'
import '../chartSetup'

const WEEKS = 18

interface Props {
  baseline: Baseline | null
}

export function PhaseCharts({ baseline }: Props) {
  const kcalRef = useRef<HTMLCanvasElement>(null)
  const waistRef = useRef<HTMLCanvasElement>(null)
  const kcalChart = useRef<Chart | null>(null)
  const waistChart = useRef<Chart | null>(null)

  useEffect(() => {
    const labels = Array.from({ length: WEEKS }, (_, i) => `Wk ${i + 1}`)
    const pers = computePersonal(baseline)

    const k1 = phaseKcal({ num: 1, name: '', week: 1, dayInPhase: 0, totalDays: 0 }, baseline)
    const k2 = phaseKcal({ num: 2, name: '', week: 7, dayInPhase: 0, totalDays: 42 }, baseline)
    const k3 = phaseKcal({ num: 3, name: '', week: 13, dayInPhase: 0, totalDays: 84 }, baseline)
    const k4 = phaseKcal({ num: 4, name: '', week: 19, dayInPhase: 0, totalDays: 126 }, baseline)

    const kcalData: (number | null)[] = []
    for (let w = 1; w <= WEEKS; w++) {
      if (pers.tdee == null) kcalData.push(null)
      else if (w <= 6) kcalData.push(k1)
      else if (w <= 12) kcalData.push(k2)
      else kcalData.push(k3)
    }

    const waistStart = baseline?.waist ?? null
    const waistTarget = baseline?.targetWaist ?? (baseline?.height != null ? Math.round(baseline.height * 0.49) : null)
    const waistData: (number | null)[] = []
    if (waistStart != null && waistTarget != null && WEEKS > 1) {
      for (let w = 0; w < WEEKS; w++) {
        const t = w / (WEEKS - 1)
        waistData.push(Math.round(waistStart + (waistTarget - waistStart) * t))
      }
    } else {
      for (let w = 0; w < WEEKS; w++) waistData.push(null)
    }

    const common = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 9 } },
        y: { grid: { color: '#eef1ec' } },
      },
    }

    const kcalDatasets: ChartDataset<'line'>[] = [
      {
        label: 'Target kcal (phase bands)',
        data: kcalData,
        stepped: 'before' as const,
        borderColor: '#1f3d2e',
        backgroundColor: 'rgba(31,61,46,0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0,
        pointRadius: 0,
      },
    ]
    if (pers.tdee != null && k4 != null) {
      kcalDatasets.push({
        label: 'Maintenance (phase 4)',
        data: labels.map(() => k4),
        borderColor: 'rgba(138,149,147,0.7)',
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      })
    }

    if (kcalRef.current) {
      kcalChart.current?.destroy()
      kcalChart.current = new Chart(kcalRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: kcalDatasets,
        },
        options: {
          ...common,
          plugins: {
            ...common.plugins,
            tooltip: { mode: 'index' as const, intersect: false },
          },
        },
      })
    }

    if (waistRef.current) {
      waistChart.current?.destroy()
      waistChart.current = new Chart(waistRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Illustrative waist trajectory',
              data: waistData,
              borderColor: '#b8502e',
              backgroundColor: 'rgba(184,80,46,0.1)',
              borderWidth: 2,
              tension: 0.25,
              pointRadius: 0,
              fill: true,
            },
          ],
        },
        options: {
          ...common,
          plugins: {
            ...common.plugins,
            tooltip: {
              callbacks: {
                label: (c) => (c.parsed.y != null ? `${c.parsed.y} cm` : '—'),
              },
            },
          },
          scales: {
            ...common.scales,
            y: { ...common.scales.y, title: { display: true, text: 'cm' } },
          },
        },
      })
    }

    return () => {
      kcalChart.current?.destroy()
      waistChart.current?.destroy()
      kcalChart.current = null
      waistChart.current = null
    }
  }, [baseline])

  return (
    <div className="two-col-grid" style={{ marginTop: 14 }}>
      <div className="card">
        <div className="section-title">18-week energy</div>
        <h3 className="section-h section-h--flush">Phase-stepped calories</h3>
        <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
          Uses the same phase bands as Coach (Primer → Attack → Consolidate). Add a baseline on My Progress for
          numbers.
        </p>
        <div style={{ height: 260 }}>
          <canvas ref={kcalRef} />
        </div>
      </div>
      <div className="card">
        <div className="section-title">Projection</div>
        <h3 className="section-h section-h--flush">Waist (linear model)</h3>
        <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
          Straight-line interpolation from current waist to target (or WHtR 0.49 × height). Not a forecast — a
          planning visual only.
        </p>
        <div style={{ height: 260 }}>
          <canvas ref={waistRef} />
        </div>
      </div>
    </div>
  )
}
