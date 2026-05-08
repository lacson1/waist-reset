export type ShiftStatus =
  | "confirmed"
  | "duty-doctor"
  | "on-call"
  | "admin"
  | "available"
  | "unavailable";

export type RotaBlock = {
  id: string;
  day: number; // 0 = Mon … 6 = Sun (relative to week start)
  startHour: number; // 24h
  endHour: number;
  title: string;
  subtitle?: string;
  status: ShiftStatus;
};

export const STATUS_LEGEND: { status: ShiftStatus; label: string }[] = [
  { status: "confirmed", label: "Confirmed" },
  { status: "duty-doctor", label: "Duty Doctor" },
  { status: "on-call", label: "On Call" },
  { status: "admin", label: "Admin" },
  { status: "available", label: "Available" },
  { status: "unavailable", label: "Unavailable" },
];

export const STATUS_STYLES: Record<
  ShiftStatus,
  { bg: string; border: string; text: string; dot: string }
> = {
  confirmed: {
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-900",
    dot: "bg-emerald-500",
  },
  "duty-doctor": {
    bg: "bg-sky-50",
    border: "border-sky-300",
    text: "text-sky-900",
    dot: "bg-sky-500",
  },
  "on-call": {
    bg: "bg-violet-50",
    border: "border-violet-300",
    text: "text-violet-900",
    dot: "bg-violet-500",
  },
  admin: {
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-900",
    dot: "bg-amber-500",
  },
  available: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  unavailable: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-400",
    dot: "bg-slate-300",
  },
};

export const ROTA_BLOCKS: RotaBlock[] = [
  // Mon
  {
    id: "mon-am",
    day: 0,
    startHour: 8.5,
    endHour: 12.5,
    title: "GP Surgery",
    subtitle: "Greenway Practice",
    status: "confirmed",
  },
  {
    id: "mon-pm",
    day: 0,
    startHour: 13.5,
    endHour: 17.5,
    title: "GP Surgery",
    subtitle: "Riverside Surgery",
    status: "confirmed",
  },
  // Tue
  {
    id: "tue-am",
    day: 1,
    startHour: 8,
    endHour: 13,
    title: "AM: Available",
    status: "available",
  },
  {
    id: "tue-pm",
    day: 1,
    startHour: 13,
    endHour: 18,
    title: "PM: Available",
    status: "available",
  },
  // Wed
  {
    id: "wed-duty",
    day: 2,
    startHour: 8,
    endHour: 14,
    title: "Duty Doctor",
    subtitle: "Central PCN (Weekday)",
    status: "duty-doctor",
  },
  {
    id: "wed-admin",
    day: 2,
    startHour: 14,
    endHour: 16,
    title: "Admin",
    status: "admin",
  },
  // Thu
  {
    id: "thu-am",
    day: 3,
    startHour: 8,
    endHour: 13,
    title: "GP Surgery",
    subtitle: "Brookfield Practice",
    status: "confirmed",
  },
  {
    id: "thu-pm",
    day: 3,
    startHour: 13,
    endHour: 18,
    title: "PM: Available",
    status: "available",
  },
  // Fri
  {
    id: "fri-am",
    day: 4,
    startHour: 8.5,
    endHour: 12.5,
    title: "GP Surgery",
    subtitle: "Mill View Practice",
    status: "confirmed",
  },
  {
    id: "fri-pm",
    day: 4,
    startHour: 13,
    endHour: 18,
    title: "PM: Available",
    status: "available",
  },
  // Sat
  {
    id: "sat-duty",
    day: 5,
    startHour: 9,
    endHour: 13,
    title: "Duty Doctor",
    subtitle: "Central PCN (Weekend)",
    status: "duty-doctor",
  },
  {
    id: "sat-oncall",
    day: 5,
    startHour: 14,
    endHour: 18,
    title: "On Call",
    status: "on-call",
  },
  // Sun
  {
    id: "sun",
    day: 6,
    startHour: 8,
    endHour: 18,
    title: "Not Available",
    status: "unavailable",
  },
];

export type UrgentMatch = {
  id: string;
  whenLabel: string;
  date: string;
  time: string;
  rate: string;
  duration: "Half day" | "Full day";
  role: string;
  practice: string;
  distance: string;
};

export const URGENT_MATCHES: UrgentMatch[] = [
  {
    id: "m1",
    whenLabel: "Tomorrow",
    date: "20 May",
    time: "08:00 – 12:00",
    rate: "£450",
    duration: "Half day",
    role: "GP Surgery",
    practice: "Oak Tree Practice, Bristol",
    distance: "Within 5 mi",
  },
  {
    id: "m2",
    whenLabel: "Wed 21 May",
    date: "21 May",
    time: "13:00 – 17:00",
    rate: "£460",
    duration: "Half day",
    role: "GP Surgery",
    practice: "Lakeside Practice, Bristol",
    distance: "Within 7 mi",
  },
  {
    id: "m3",
    whenLabel: "Thu 22 May",
    date: "22 May",
    time: "08:00 – 18:00",
    rate: "£900",
    duration: "Full day",
    role: "Duty Doctor (Weekday)",
    practice: "Central PCN, Bristol",
    distance: "Within 10 mi",
  },
];

export type ComplianceAlert = {
  id: string;
  label: string;
  status: "expiring" | "due";
  due: string;
  severity: "warning" | "critical";
};

export const COMPLIANCE_ALERTS: ComplianceAlert[] = [
  {
    id: "c1",
    label: "DBS certificate expires in 18 days",
    status: "expiring",
    due: "6 Jun 2025",
    severity: "critical",
  },
  {
    id: "c2",
    label: "NHS Pension – Form A due",
    status: "due",
    due: "30 Jun 2025",
    severity: "warning",
  },
  {
    id: "c3",
    label: "BLS certificate expires in 45 days",
    status: "expiring",
    due: "3 Jul 2025",
    severity: "warning",
  },
];

export type BookedSession = {
  id: string;
  time: string;
  role: string;
  practice: string;
  amount: string;
};

export const TODAY_SESSIONS: BookedSession[] = [
  {
    id: "s1",
    time: "08:30 – 12:30",
    role: "GP Surgery",
    practice: "Greenway Practice",
    amount: "£440",
  },
  {
    id: "s2",
    time: "13:30 – 17:30",
    role: "GP Surgery",
    practice: "Riverside Surgery",
    amount: "£440",
  },
];

export type CredentialItem = {
  id: string;
  label: string;
  status: "valid" | "expiring";
  detail: string;
};

export const CREDENTIALS: CredentialItem[] = [
  { id: "g1", label: "GMC Registration", status: "valid", detail: "Valid until 31 Jul 2025" },
  { id: "d1", label: "DBS Certificate", status: "expiring", detail: "Expires 6 Jun 2025" },
  { id: "n1", label: "NHS Indemnity", status: "valid", detail: "Valid until 31 Aug 2025" },
  { id: "b1", label: "BLS/CPR", status: "valid", detail: "Valid until 3 Jul 2025" },
  { id: "s3", label: "Safeguarding Level 3", status: "valid", detail: "Valid until 12 Sep 2025" },
];

export type InvoiceMonth = {
  id: string;
  month: string;
  count: number;
  amount: string;
  status: "paid" | "outstanding";
};

export const INVOICE_MONTHS: InvoiceMonth[] = [
  { id: "i1", month: "May 2025", count: 4, amount: "£1,760.00", status: "paid" },
  { id: "i2", month: "Apr 2025", count: 5, amount: "£2,240.00", status: "paid" },
  { id: "i3", month: "Mar 2025", count: 3, amount: "£1,320.00", status: "paid" },
  { id: "i4", month: "Feb 2025", count: 4, amount: "£1,870.00", status: "paid" },
];

export type Message = {
  id: string;
  practice: string;
  body: string;
  when: string;
};

export const PRACTICE_MESSAGES: Message[] = [
  {
    id: "m1",
    practice: "Brookfield Practice",
    body: "New session available next week",
    when: "10:12",
  },
  {
    id: "m2",
    practice: "Greenway Practice",
    body: "Sickness cover 23–24 May",
    when: "Yesterday",
  },
  {
    id: "m3",
    practice: "Central PCN",
    body: "Weekend Duty Doctor rota update",
    when: "16 May",
  },
];

export const ANALYTICS = {
  sessions: { value: 124, deltaPct: 8 },
  earnings: { value: "£29,450", deltaPct: 12 },
  utilisation: { value: "78%", deltaPct: 6 },
};
