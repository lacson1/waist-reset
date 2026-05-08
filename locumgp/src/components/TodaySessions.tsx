import { TODAY_SESSIONS } from "../data/mockDashboard";

export function TodaySessions() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Today's Booked Sessions{" "}
          <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
            {TODAY_SESSIONS.length}
          </span>
        </h2>
      </header>
      <ul className="divide-y divide-slate-100">
        {TODAY_SESSIONS.map((s) => (
          <li key={s.id} className="flex items-center gap-4 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-900">{s.time}</div>
              <div className="text-xs text-slate-500">
                {s.role} · {s.practice}
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-900">{s.amount}</div>
            <button className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
              View
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-100 px-5 py-3">
        <a className="text-xs font-medium text-brand-600 hover:underline" href="#">
          View today's schedule
        </a>
      </div>
    </section>
  );
}
