import { AlertTriangle } from "lucide-react";
import { COMPLIANCE_ALERTS } from "../data/mockDashboard";
import { cn } from "../lib/cn";

export function ComplianceAlerts() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Compliance Alerts</h2>
      </header>
      <ul className="divide-y divide-slate-100">
        {COMPLIANCE_ALERTS.map((a) => (
          <li key={a.id} className="flex items-center gap-3 px-5 py-3 text-sm">
            <AlertTriangle
              className={cn(
                "h-4 w-4 shrink-0",
                a.severity === "critical" ? "text-rose-500" : "text-amber-500",
              )}
              aria-hidden
            />
            <span className="flex-1 truncate text-slate-700">{a.label}</span>
            <span className="text-xs text-slate-500">{a.due}</span>
            <span className="text-slate-300" aria-hidden>›</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-100 px-5 py-3">
        <a className="text-xs font-medium text-brand-600 hover:underline" href="#">
          View all compliance
        </a>
      </div>
    </section>
  );
}
