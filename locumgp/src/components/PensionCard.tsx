export function PensionCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">NHS Pension (PCSE)</h2>
        <a href="#" className="text-xs font-medium text-brand-600 hover:underline">
          View
        </a>
      </header>
      <ul className="divide-y divide-slate-100">
        <li className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
          <span className="font-medium text-slate-900">Form A</span>
          <span className="text-slate-500">2024/25</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            Due 30 Jun 2025
          </span>
        </li>
        <li className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
          <span className="font-medium text-slate-900">Form B</span>
          <span className="text-slate-500">2024/25</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            Received
          </span>
        </li>
      </ul>
    </section>
  );
}
