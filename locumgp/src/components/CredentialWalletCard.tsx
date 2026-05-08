import { ShieldCheck, AlertTriangle, Award, FileBadge2 } from "lucide-react";
import { CREDENTIALS, type CredentialItem } from "../data/mockDashboard";
import { cn } from "../lib/cn";

const ICONS: Record<CredentialItem["id"], typeof ShieldCheck> = {
  g1: Award,
  d1: FileBadge2,
  n1: ShieldCheck,
  b1: ShieldCheck,
  s3: ShieldCheck,
};

export function CredentialWalletCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Credential Wallet</h2>
        <a href="#" className="text-xs font-medium text-brand-600 hover:underline">
          View all
        </a>
      </header>
      <ul className="divide-y divide-slate-100">
        {CREDENTIALS.map((c) => {
          const Icon = ICONS[c.id] ?? ShieldCheck;
          const expiring = c.status === "expiring";
          return (
            <li key={c.id} className="flex items-center gap-3 px-5 py-3 text-sm">
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full",
                  expiring ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="flex-1 truncate font-medium text-slate-900">{c.label}</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  expiring ? "text-amber-700" : "text-emerald-700",
                )}
              >
                {expiring && <AlertTriangle className="h-3.5 w-3.5" aria-hidden />}
                {c.detail}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
