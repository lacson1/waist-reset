import { INVOICE_MONTHS } from "../data/mockDashboard";

export function InvoicesCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Invoices &amp; Payments</h2>
        <a href="#" className="text-xs font-medium text-brand-600 hover:underline">
          View all
        </a>
      </header>
      <ul className="divide-y divide-slate-100">
        {INVOICE_MONTHS.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-5 py-3 text-sm">
            <span className="flex-1 font-medium text-slate-900">{m.month}</span>
            <span className="text-xs text-slate-500">({m.count} invoices)</span>
            <span className="font-semibold text-slate-900">{m.amount}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 capitalize">
              {m.status}
            </span>
          </li>
        ))}
        <li className="flex items-center justify-between bg-rose-50/40 px-5 py-3 text-sm">
          <span className="font-medium text-rose-700">Outstanding</span>
          <span className="font-semibold text-rose-700">£0.00</span>
        </li>
      </ul>
    </section>
  );
}
