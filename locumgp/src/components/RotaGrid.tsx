import { Info, ChevronLeft, ChevronRight, ChevronDown, CalendarDays } from "lucide-react";
import {
  ROTA_BLOCKS,
  STATUS_LEGEND,
  STATUS_STYLES,
  type RotaBlock,
} from "../data/mockDashboard";
import { cn } from "../lib/cn";

const DAY_HEADINGS = [
  { short: "Mon", date: "19 May" },
  { short: "Tue", date: "20 May" },
  { short: "Wed", date: "21 May" },
  { short: "Thu", date: "22 May" },
  { short: "Fri", date: "23 May" },
  { short: "Sat", date: "24 May" },
  { short: "Sun", date: "25 May" },
];

const DAY_START = 8;
const DAY_END = 18;
const HOUR_LABELS = Array.from(
  { length: DAY_END - DAY_START + 1 },
  (_, i) => DAY_START + i,
);

const ROW_PX = 48;
const TIME_COL_PX = 56;

function blockTop(block: RotaBlock) {
  return (block.startHour - DAY_START) * ROW_PX;
}

function blockHeight(block: RotaBlock) {
  return (block.endHour - block.startHour) * ROW_PX;
}

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}

function formatRange(start: number, end: number) {
  const fmt = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export function RotaGrid() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          My Availability &amp; Rota
          <Info className="h-4 w-4 text-slate-400" aria-hidden />
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill label="All Locations" />
          <FilterPill label="All Practices" />
          <NavPill>
            <button className="grid h-7 w-7 place-items-center rounded hover:bg-slate-100" aria-label="Previous day">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-1 text-sm font-medium text-slate-700">Today</span>
            <button className="grid h-7 w-7 place-items-center rounded hover:bg-slate-100" aria-label="Next day">
              <ChevronRight className="h-4 w-4" />
            </button>
          </NavPill>
          <NavPill>
            <button className="grid h-7 w-7 place-items-center rounded hover:bg-slate-100" aria-label="Previous week">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm font-medium text-slate-700">19 – 25 May 2025</span>
            <CalendarDays className="mr-1 h-4 w-4 text-slate-400" />
          </NavPill>
          <FilterPill label="Week" />
        </div>
      </header>

      <div className="overflow-x-auto">
        <div className="min-w-[820px] px-5 pt-4 pb-5">
          <div className="grid" style={{ gridTemplateColumns: `${TIME_COL_PX}px repeat(7, minmax(0, 1fr))` }}>
            <div />
            {DAY_HEADINGS.map((h) => (
              <div key={h.short} className="px-2 pb-2 text-xs font-semibold text-slate-500">
                <span className="text-slate-700">{h.short}</span>{" "}
                <span className="text-slate-400">{h.date}</span>
              </div>
            ))}

            <div className="text-xs font-medium text-slate-400 pr-2 text-right">All day</div>
            {DAY_HEADINGS.map((h) => (
              <div key={`allday-${h.short}`} className="border-t border-slate-100 h-6" />
            ))}
          </div>

          <div
            className="relative mt-1 grid"
            style={{
              gridTemplateColumns: `${TIME_COL_PX}px repeat(7, minmax(0, 1fr))`,
              height: HOUR_LABELS.length * ROW_PX,
            }}
          >
            {HOUR_LABELS.map((h, i) => (
              <div
                key={h}
                className="pr-2 text-right text-xs font-medium text-slate-400"
                style={{ gridColumn: 1, gridRow: `${i + 1} / span 1`, height: ROW_PX }}
              >
                {formatHour(h)}
              </div>
            ))}

            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div
                key={`col-${day}`}
                className={cn("relative border-l border-slate-100", day === 6 && "bg-slate-50/60")}
                style={{ gridColumn: day + 2, gridRow: `1 / span ${HOUR_LABELS.length}` }}
              >
                {HOUR_LABELS.map((_, i) => (
                  <div key={i} className="border-b border-dashed border-slate-100" style={{ height: ROW_PX }} />
                ))}

                {ROTA_BLOCKS.filter((b) => b.day === day).map((block) => {
                  const styles = STATUS_STYLES[block.status];
                  return (
                    <div
                      key={block.id}
                      className={cn(
                        "absolute right-1 left-1 rounded-md border-l-4 px-2 py-1.5 text-[11px] leading-tight shadow-sm",
                        styles.bg,
                        styles.border,
                        styles.text,
                      )}
                      style={{
                        top: blockTop(block),
                        height: blockHeight(block) - 2,
                      }}
                    >
                      <div className="font-semibold">{block.title}</div>
                      {block.subtitle && (
                        <div className="opacity-80">
                          {formatRange(block.startHour, block.endHour)}
                        </div>
                      )}
                      {block.subtitle && <div className="truncate opacity-70">{block.subtitle}</div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            {STATUS_LEGEND.map((l) => (
              <span key={l.status} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", STATUS_STYLES[l.status].dot)} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      {label}
      <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
    </button>
  );
}

function NavPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex h-9 items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1">
      {children}
    </div>
  );
}
