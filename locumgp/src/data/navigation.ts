import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck2,
  Building2,
  Sparkles,
  Wallet,
  ShieldCheck,
  Receipt,
  PoundSterling,
  FileBarChart,
  Landmark,
  MessagesSquare,
  Folder,
  Settings,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/rota", label: "Rota & Availability", icon: CalendarDays },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck2 },
  { to: "/practices", label: "Practices & PCNs", icon: Building2 },
  { to: "/shift-matches", label: "Shift Matches", icon: Sparkles },
  { to: "/credentials", label: "Credential Wallet", icon: Wallet },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/invoices", label: "Invoices & Payments", icon: Receipt },
  { to: "/expenses", label: "Expenses", icon: PoundSterling },
  { to: "/tax", label: "Tax & Reporting", icon: FileBarChart },
  { to: "/pension", label: "Pension (NHS)", icon: Landmark },
  { to: "/messages", label: "Messages", icon: MessagesSquare },
  { to: "/documents", label: "Documents", icon: Folder },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help & Support", icon: CircleHelp },
];
