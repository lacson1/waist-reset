import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js'
import type { Baseline, ProgressEntry } from '../types/progress'
import { coachChartPredicted, coachChartVelocity } from '../domain/coach'

interface Props {
  baseline: Baseline | null
  entries: ProgressEntry[]
}

export function CoachCharts({ baseline, entries }: Props) {
  const velRef = useRef<HTMLCanvasElement>(null)
  const predRef = useRef<HTMLCanvasElement>(null)
  const velChart = useRef<Chart | null>(null)
  const predChart = useRef<Chart | null>(null)

  useEffect(() => {
    const common = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } },
        y: { grid: { color: '#eef1ec' } },
      },
    }

    if (velRef.current) {
      velChart.current = new Chart(velRef.current, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'cm/week',
              data: [],
              backgroundColor: (ctx) => {
                const v = ctx.parsed?.y
                if (v == null) return '#c69a1f'
                if (v < -0.25) return '#1a8a5a'
                if (v < 0) return '#6a8856'
                if (v < 0.25) return '#c69a1f'
                return '#b83545'
              },
              borderWidth: 0,
              borderRadius: 4,
            },
          ],
        },
        options: {
          ...common,
          plugins: {
            ...common.plugins,
            tooltip: {
              callbacks: {
                label: (c) => `${c.parsed.y != null ? c.parsed.y.toFixed(2) : '—'} cm/wk`,
              },
            },
          },
          scales: {
            ...common.scales,
            y: { ...common.scales.y, ticks: { callback: (v) => Number(v).toFixed(2) } },
          },
        },
      })
    }

    if (predRef.current) {
      predChart.current = new Chart(predRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Actual',
              data: [],
              borderColor: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.12)',
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 3,
              fill: true,
            },
            {
              label: 'Predicted',
              data: [],
              borderColor: '#b8502e',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          ...common,
          plugins: {
            ...common.plugins,
            legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          },
          scales: {
            ...common.scales,
            y: { ...common.scales.y, ticks: { callback: (v) => `${v} cm` } },
          },
        },
      })
    }

    return () => {
      velChart.current?.destroy()
      predChart.current?.destroy()
      velChart.current = null
      predChart.current = null
    }
  }, [])

  useEffect(() => {
    const { labels, data } = coachChartVelocity(baseline, entries)
    if (velChart.current) {
      velChart.current.data.labels = labels
      velChart.current.data.datasets[0].data = data
      velChart.current.update('none')
    }
    const pred = coachChartPredicted(baseline, entries)
    if (predChart.current) {
      predChart.current.data.labels = pred.labels
      predChart.current.data.datasets[0].data = pred.actual
      predChart.current.data.datasets[1].data = pred.predicted
      predChart.current.update('none')
    }
  }, [baseline, entries])

  return (
    <div className="chart-row">
      <div className="chart-card">
        <h3>Waist Velocity (cm / week)</h3>
        <canvas ref={velRef} />
      </div>
      <div className="chart-card">
        <h3>Predicted vs Actual Waist</h3>
        <canvas ref={predRef} />
      </div>
    </div>
  )
}
