import { useState } from "react";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { Tabs } from "../../../../../apps/web/src/shared/components/Tabs";
import { GearEnchantsTab } from "../../audit/components/GearEnchantsTab";
import { GearOverviewTab } from "../../audit/components/GearOverviewTab";
import { GearUpgradesTab } from "../../audit/components/GearUpgradesTab";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { RosterSummaryTab } from "../components/RosterSummaryTab";

type RosterPageTab =
  | "summary"
  | "gear-overview"
  | "gear-upgrades"
  | "gear-enchants";

const tabs: Array<{
  id: RosterPageTab;
  label: string;
}> = [
  {
    id: "summary",
    label: "Summary"
  },
  {
    id: "gear-overview",
    label: "Gear overview"
  },
  {
    id: "gear-upgrades",
    label: "Gear upgrades"
  },
  {
    id: "gear-enchants",
    label: "Gear enchants"
  }
];

export function RosterPage() {
  const [activeTab, setActiveTab] =
    useState<RosterPageTab>(
      "summary"
    );

  return (
    <div className="guild-page">
      <PageHeader
        description="Roster, gear compliance and audit coverage in one place."
        eyebrow="GUILD"
        title="Roster"
      />

      <GuildVerificationGate>
        <Tabs
          activeTab={activeTab}
          ariaLabel="Roster"
          onChange={setActiveTab}
          tabs={tabs}
        />

        <div className="app-tab-content">
          {activeTab ===
            "summary" && (
            <RosterSummaryTab />
          )}

          {activeTab ===
            "gear-overview" && (
            <GearOverviewTab />
          )}

          {activeTab ===
            "gear-upgrades" && (
            <GearUpgradesTab />
          )}

          {activeTab ===
            "gear-enchants" && (
            <GearEnchantsTab />
          )}
        </div>
      </GuildVerificationGate>
    </div>
  );
}
