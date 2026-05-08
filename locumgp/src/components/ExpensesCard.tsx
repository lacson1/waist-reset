import { Receipt } from "lucide-react";

export function ExpensesCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Expenses <span className="ml-1 text-xs font-normal text-slate-500">(This Tax Year)</span>
        </h2>
        <a href="#" className="text-xs font-medium text-brand-600 hover:underline">
          View
        </a>
      </header>
      <div className="flex items-center justify-between px-5 py-6">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-slate-900">£1,245.80</div>
          <div className="mt-1 text-xs text-slate-500">48 expenses claimed</div>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Receipt className="h-6 w-6" aria-hidden />
        </div>
      </div>
    </section>
  );
}
