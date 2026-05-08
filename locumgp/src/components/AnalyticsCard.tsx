import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { ANALYTICS } from "../data/mockDashboard";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip);

const COMMON_OPTS = {
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: {
    x: { display: false },
    y: { display: false },
  },
  elements: {
    line: { tension: 0.4, borderWidth: 2 },
    point: { radius: 0 },
  },
  maintainAspectRatio: false,
};

function makeSeries(seed: number) {
  return Array.from({ length: 12 }, (_, i) => Math.round(40 + 20 * Math.sin(i / 1.5 + seed) + i * 2));
}

export function AnalyticsCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Analytics{" "}
          <span className="ml-1 text-xs font-normal text-slate-500">(Last 12 Months)</span>
        </h2>
        <a href="#" className="text-xs font-medium text-brand-600 hover:underline">
          View full report
        </a>
      </header>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">
        <Metric
          label="Sessions Completed"
          value={String(ANALYTICS.sessions.value)}
          delta={`+${ANALYTICS.sessions.deltaPct}% vs previous 12 months`}
          color="#1656b8"
          seed={0}
        />
        <Metric
          label="Earnings"
          value={ANALYTICS.earnings.value}
          delta={`+${ANALYTICS.earnings.deltaPct}% vs previous 12 months`}
          color="#0d9488"
          seed={1.5}
        />
        <Metric
          label="Utilisation Rate"
          value={ANALYTICS.utilisation.value}
          delta={`+${ANALYTICS.utilisation.deltaPct}% vs previous 12 months`}
          color="#7c3aed"
          seed={3}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  delta,
  color,
  seed,
}: {
  label: string;
  value: string;
  delta: string;
  color: string;
  seed: number;
}) {
  const series = makeSeries(seed);
  return (
    <div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-0.5 text-[11px] text-emerald-700">{delta}</div>
      <div className="mt-3 h-12">
        <Line
          data={{
            labels: series.map((_, i) => i),
            datasets: [
              {
                data: series,
                borderColor: color,
                backgroundColor: `${color}1a`,
                fill: true,
              },
            ],
          }}
          options={COMMON_OPTS}
        />
      </div>
    </div>
  );
}
