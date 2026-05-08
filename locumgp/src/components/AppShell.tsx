import { NavLink, Outlet } from "react-router-dom";
import { Bell, ChevronDown, Search } from "lucide-react";
import { NAV_ITEMS } from "../data/navigation";
import { MOCK_USER } from "../data/mockUser";
import { cn } from "../lib/cn";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-brand-900 text-brand-50 md:flex">
      <div className="px-6 pt-6 pb-4">
        <span className="text-2xl font-semibold tracking-tight">
          Locum<span className="text-brand-200">GP</span>
        </span>
      </div>

      <div className="mx-3 mb-3 flex items-center gap-3 rounded-lg bg-brand-800/60 p-3">
        <img
          src={MOCK_USER.avatarUrl}
          alt=""
          className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-700"
        />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-medium text-white">
            {MOCK_USER.name}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-200">
            <span className="truncate">{MOCK_USER.gmc}</span>
            {MOCK_USER.verified && (
              <span className="rounded-sm bg-emerald-500/20 px-1.5 py-px text-[10px] font-semibold text-emerald-200">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-white/10 font-medium text-white"
                        : "text-brand-100 hover:bg-white/5 hover:text-white",
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-brand-800 px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-brand-100 hover:bg-white/5 hover:text-white"
        >
          <span className="grid h-4 w-4 place-items-center text-base leading-none">
            ↪
          </span>
          Sign out
        </button>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <label className="relative max-w-xl flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search practices, PCNs, shifts…"
          className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <button
        type="button"
        className="relative grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
          3
        </span>
      </button>

      <button
        type="button"
        className="flex items-center gap-2 rounded-full pr-2 pl-1 hover:bg-slate-100"
      >
        <img
          src={MOCK_USER.avatarUrl}
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-slate-700">
          {MOCK_USER.name}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
      </button>
    </header>
  );
}
