import { Construction } from "lucide-react";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Construction className="h-6 w-6" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">
          This area is part of the upcoming GSD-driven build. Run{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
            /gsd-new-project
          </code>{" "}
          to plan and ship it.
        </p>
      </div>
    </div>
  );
}
