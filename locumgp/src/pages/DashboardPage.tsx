import { RotaGrid } from "../components/RotaGrid";
import { UrgentMatches } from "../components/UrgentMatches";
import { ComplianceAlerts } from "../components/ComplianceAlerts";
import { PensionCard } from "../components/PensionCard";
import { TodaySessions } from "../components/TodaySessions";
import { CredentialWalletCard } from "../components/CredentialWalletCard";
import { InvoicesCard } from "../components/InvoicesCard";
import { ExpensesCard } from "../components/ExpensesCard";
import { TaxReportingCard } from "../components/TaxReportingCard";
import { MessagesCard } from "../components/MessagesCard";
import { AnalyticsCard } from "../components/AnalyticsCard";

export function DashboardPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <RotaGrid />

        <div className="grid gap-6 md:grid-cols-3">
          <TodaySessions />
          <CredentialWalletCard />
          <InvoicesCard />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ExpensesCard />
          <TaxReportingCard />
          <div className="md:col-span-2">
            <MessagesCard />
          </div>
        </div>

        <AnalyticsCard />
      </div>

      <aside className="flex flex-col gap-6">
        <UrgentMatches />
        <ComplianceAlerts />
        <PensionCard />
      </aside>
    </div>
  );
}
