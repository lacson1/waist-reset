import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export function TaxReportingCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Tax Reporting</h2>
        <a href="#" className="text-xs font-medium text-brand-600 hover:underline">
          View
        </a>
      </header>
      <div className="flex items-center justify-between gap-4 px-5 py-5">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900">2024/25</div>
          <div className="mt-0.5 text-xs text-slate-500">Self Assessment</div>
          <span className="mt-3 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
            In Progress
          </span>
        </div>
        <div className="relative h-24 w-24 shrink-0">
          <Doughnut
            data={{
              labels: ["Income", "Expenses", "Tax owed"],
              datasets: [
                {
                  data: [62, 18, 20],
                  backgroundColor: ["#1656b8", "#3a8aea", "#d9eafd"],
                  borderWidth: 0,
                },
              ],
            }}
            options={{
              cutout: "70%",
              plugins: { legend: { display: false }, tooltip: { enabled: true } },
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </section>
  );
}
