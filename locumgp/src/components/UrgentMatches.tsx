import { URGENT_MATCHES } from "../data/mockDashboard";
import { cn } from "../lib/cn";

export function UrgentMatches() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          Urgent Shift Matches
          <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-100 text-[11px] font-semibold text-rose-700">
            {URGENT_MATCHES.length}
          </span>
        </h2>
      </header>

      <ul className="divide-y divide-slate-100">
        {URGENT_MATCHES.map((m) => (
          <li key={m.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{m.whenLabel}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{m.time}</span>
                </div>
                <div className="mt-1 truncate text-sm font-semibold text-slate-900">{m.role}</div>
                <div className="truncate text-xs text-slate-500">{m.practice}</div>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold text-slate-900">{m.rate}</div>
                <div className="text-[11px] text-slate-500">{m.duration}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700",
                )}
              >
                {m.distance}
              </span>
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-md bg-brand-600 px-3 text-xs font-semibold text-white hover:bg-brand-700"
              >
                View &amp; Apply
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="px-5 py-3">
        <a className="text-xs font-medium text-brand-600 hover:underline" href="#">
          View all matches
        </a>
      </div>
    </section>
  );
}
