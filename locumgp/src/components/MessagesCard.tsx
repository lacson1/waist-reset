import { PRACTICE_MESSAGES } from "../data/mockDashboard";

export function MessagesCard() {
  const unread = PRACTICE_MESSAGES.length;
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Practice Messages</h2>
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
          {unread} unread
        </span>
      </header>
      <ul className="divide-y divide-slate-100">
        {PRACTICE_MESSAGES.map((m) => (
          <li key={m.id} className="flex items-start gap-3 px-5 py-3 text-sm">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-slate-900">{m.practice}</div>
              <div className="truncate text-xs text-slate-500">{m.body}</div>
            </div>
            <div className="text-xs text-slate-500">{m.when}</div>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-100 px-5 py-3">
        <a className="text-xs font-medium text-brand-600 hover:underline" href="#">
          View all messages
        </a>
      </div>
    </section>
  );
}
