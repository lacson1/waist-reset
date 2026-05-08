import type { RouteObject } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

export const router: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "rota", element: <PlaceholderPage title="Rota & Availability" /> },
      { path: "bookings", element: <PlaceholderPage title="Bookings" /> },
      { path: "practices", element: <PlaceholderPage title="Practices & PCNs" /> },
      { path: "shift-matches", element: <PlaceholderPage title="Shift Matches" /> },
      { path: "credentials", element: <PlaceholderPage title="Credential Wallet" /> },
      { path: "compliance", element: <PlaceholderPage title="Compliance" /> },
      { path: "invoices", element: <PlaceholderPage title="Invoices & Payments" /> },
      { path: "expenses", element: <PlaceholderPage title="Expenses" /> },
      { path: "tax", element: <PlaceholderPage title="Tax & Reporting" /> },
      { path: "pension", element: <PlaceholderPage title="Pension (NHS)" /> },
      { path: "messages", element: <PlaceholderPage title="Messages" /> },
      { path: "documents", element: <PlaceholderPage title="Documents" /> },
      { path: "settings", element: <PlaceholderPage title="Settings" /> },
      { path: "help", element: <PlaceholderPage title="Help & Support" /> },
    ],
  },
];
