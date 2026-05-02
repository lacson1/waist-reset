import { useEffect, useRef } from 'react'
import { Chart, type Chart as ChartType } from 'chart.js'
import type { Baseline, ProgressEntry } from '../types/progress'
import { computeTgHdl } from '../domain/personalisation'

function fmt(n: number | null | undefined, d = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return (+n).toFixed(d)
}

interface Props {
  baseline: Baseline | null
  entries: ProgressEntry[]
}

export function ProgressCharts({ baseline, entries }: Props) {
  const waistRef = useRef<HTMLCanvasElement>(null)
  const weightRef = useRef<HTMLCanvasElement>(null)
  const tghdlRef = useRef<HTMLCanvasElement>(null)
  const adhRef = useRef<HTMLCanvasElement>(null)
  const charts = useRef<{
    waist?: ChartType
    weight?: ChartType
    tghdl?: ChartType
    adh?: ChartType
  }>({})

  useEffect(() => {
    const common = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
        y: { grid: { color: '#eef1ec' } },
      },
    }

    if (waistRef.current && !charts.current.waist) {
      charts.current.waist = new Chart(waistRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Waist',
              data: [],
              borderColor: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.12)',
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 4,
              fill: true,
            },
            {
              label: 'Baseline',
              data: [],
              borderColor: 'rgba(138,149,147,0.5)',
              borderWidth: 1.5,
              borderDash: [6, 4],
              pointRadius: 0,
              fill: false,
            },
            {
              label: 'Target',
              data: [],
              borderColor: 'rgba(26,138,90,0.6)',
              borderWidth: 1.5,
              borderDash: [3, 3],
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
            tooltip: {
              ...common.plugins.tooltip,
              callbacks: { label: (c) => `${c.dataset.label}: ${fmt(c.parsed.y, 1)} cm` },
            },
          },
          scales: {
            ...common.scales,
            y: { ...common.scales.y, ticks: { callback: (v) => `${v} cm` } },
          },
        },
      })
    }

    if (weightRef.current && !charts.current.weight) {
      charts.current.weight = new Chart(weightRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Weight',
              data: [],
              borderColor: '#b8502e',
              backgroundColor: 'rgba(184,80,46,0.12)',
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 4,
              fill: true,
            },
            {
              label: 'Baseline',
              data: [],
              borderColor: 'rgba(138,149,147,0.5)',
              borderWidth: 1.5,
              borderDash: [6, 4],
              pointRadius: 0,
              fill: false,
            },
            {
              label: 'Target',
              data: [],
              borderColor: 'rgba(26,138,90,0.6)',
              borderWidth: 1.5,
              borderDash: [3, 3],
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
            tooltip: {
              ...common.plugins.tooltip,
              callbacks: { label: (c) => `${c.dataset.label}: ${fmt(c.parsed.y, 1)} kg` },
            },
          },
          scales: {
            ...common.scales,
            y: { ...common.scales.y, ticks: { callback: (v) => `${v} kg` } },
          },
        },
      })
    }

    if (tghdlRef.current && !charts.current.tghdl) {
      charts.current.tghdl = new Chart(tghdlRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'TG:HDL',
              data: [],
              borderColor: '#c69a1f',
              backgroundColor: 'rgba(198,154,31,0.15)',
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 5,
              fill: true,
            },
            {
              label: 'Target < 2.0',
              data: [],
              borderColor: 'rgba(26,138,90,0.6)',
              borderWidth: 1.5,
              borderDash: [3, 3],
              pointRadius: 0,
              fill: false,
            },
            {
              label: 'Optimal < 1.5',
              data: [],
              borderColor: 'rgba(15,118,110,0.5)',
              borderWidth: 1.5,
              borderDash: [2, 3],
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
            tooltip: {
              ...common.plugins.tooltip,
              callbacks: { label: (c) => `${c.dataset.label}: ${fmt(c.parsed.y, 2)}` },
            },
          },
          scales: {
            ...common.scales,
            y: { ...common.scales.y, beginAtZero: true, ticks: { callback: (v) => fmt(Number(v), 1) } },
          },
        },
      })
    }

    if (adhRef.current && !charts.current.adh) {
      charts.current.adh = new Chart(adhRef.current, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Adherence',
              data: [],
              backgroundColor: 'rgba(122,59,92,0.7)',
              borderColor: '#7a3b5c',
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          ...common,
          plugins: {
            ...common.plugins,
            tooltip: { callbacks: { label: (c) => `${c.parsed.y}%` } },
          },
          scales: {
            ...common.scales,
            y: { ...common.scales.y, beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } },
          },
        },
      })
    }

    return () => {
      Object.values(charts.current).forEach((c) => c?.destroy())
      charts.current = {}
    }
  }, [])

  useEffect(() => {
    const b = baseline
    const e = entries
    const labels = e.map((x) => x.date)
    const n = labels.length

    const w = charts.current.waist
    if (w) {
      w.data.labels = labels
      w.data.datasets[0].data = e.map((x) => x.waist) as (number | null)[]
      w.data.datasets[1].data = b?.waist != null ? Array(n).fill(b.waist) : []
      w.data.datasets[2].data = b?.targetWaist != null ? Array(n).fill(b.targetWaist) : []
      w.update('none')
    }

    const wt = charts.current.weight
    if (wt) {
      wt.data.labels = labels
      wt.data.datasets[0].data = e.map((x) => x.weight) as (number | null)[]
      wt.data.datasets[1].data = b?.weight != null ? Array(n).fill(b.weight) : []
      wt.data.datasets[2].data = b?.targetWeight != null ? Array(n).fill(b.targetWeight) : []
      wt.update('none')
    }

    const tg = charts.current.tghdl
    if (tg) {
      let curTg = b?.tg ?? null
      let curHdl = b?.hdl ?? null
      const ratios = e.map((x) => {
        if (x.tg != null) curTg = x.tg
        if (x.hdl != null) curHdl = x.hdl
        return computeTgHdl(curTg, curHdl)
      })
      tg.data.labels = labels
      tg.data.datasets[0].data = ratios as (number | null)[]
      tg.data.datasets[1].data = Array(n).fill(2.0)
      tg.data.datasets[2].data = Array(n).fill(1.5)
      tg.update('none')
    }

    const ad = charts.current.adh
    if (ad) {
      ad.data.labels = labels
      ad.data.datasets[0].data = e.map((x) => x.adherence) as (number | null)[]
      ad.update('none')
    }
  }, [baseline, entries])

  return (
    <>
      <div className="chart-row">
        <div className="chart-card">
          <h3>Waist Circumference (cm)</h3>
          <canvas ref={waistRef} />
        </div>
        <div className="chart-card">
          <h3>Weight (kg)</h3>
          <canvas ref={weightRef} />
        </div>
      </div>
      <div className="chart-row">
        <div className="chart-card">
          <h3>TG:HDL Ratio · Primary VAT Biomarker</h3>
          <canvas ref={tghdlRef} />
        </div>
        <div className="chart-card">
          <h3>Adherence (%)</h3>
          <canvas ref={adhRef} />
        </div>
      </div>
    </>
  )
}
