import { useState } from "react";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { Tabs } from "../../../../../apps/web/src/shared/components/Tabs";
import { BattleNetSyncTab } from "../../../../data-platform/web/integrations/components/BattleNetSyncTab";
import { GuildVerificationPanel } from "../../verification/components/GuildVerificationPanel";
import { GuildVerificationStatusCard } from "../../verification/components/GuildVerificationStatusCard";
import { useGuildVerification } from "../../verification/hooks/useGuildVerification";

type GuildSettingsTab = "verification" | "battlenet";

const tabs: Array<{
  id: GuildSettingsTab;
  label: string;
}> = [
  {
    id: "verification",
    label: "Verification"
  },
  {
    id: "battlenet",
    label: "Battle.net"
  }
];

export function GuildSettingsPage() {
  const verification =
    useGuildVerification();

  const [activeTab, setActiveTab] =
    useState<GuildSettingsTab>(
      "verification"
    );

  return (
    <div className="guild-page guild-page-narrow">
      <PageHeader
        description="Guild identity, leadership verification and Battle.net sync."
        eyebrow="GUILD"
        title="Settings"
      />

      <Tabs
        activeTab={activeTab}
        ariaLabel="Guild Settings"
        onChange={setActiveTab}
        tabs={tabs}
      />

      <div className="app-tab-content">
        {activeTab ===
          "verification" && (
          <>
            {verification.error && (
              <StatusMessage type="error">
                {verification.error}
              </StatusMessage>
            )}

            {verification.isLoadingStatus ? (
              <LoadingPanel />
            ) : verification.status
              ?.verified ? (
              <GuildVerificationStatusCard
                status={
                  verification.status
                }
              />
            ) : (
              <GuildVerificationPanel
                candidates={
                  verification.candidates
                }
                isLoadingCandidates={
                  verification.isLoadingCandidates
                }
                isLookingUpGuild={
                  verification.isLookingUpGuild
                }
                isVerifying={
                  verification.isVerifying
                }
                onLoadCandidates={() => {
                  void verification.loadCandidates();
                }}
                onLookupGuild={(
                  realmName,
                  guildName
                ) => {
                  void verification.lookup(
                    realmName,
                    guildName
                  );
                }}
                onVerify={(
                  characterName,
                  characterRealmSlug
                ) => {
                  void verification.verify(
                    characterName,
                    characterRealmSlug
                  );
                }}
              />
            )}
          </>
        )}

        {activeTab === "battlenet" && (
          <BattleNetSyncTab />
        )}
      </div>
    </div>
  );
}
