import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { GuildVerificationPanel } from "../../verification/components/GuildVerificationPanel";
import { GuildVerificationStatusCard } from "../../verification/components/GuildVerificationStatusCard";
import { useGuildVerification } from "../../verification/hooks/useGuildVerification";

export function GuildSettingsPage() {
  const verification =
    useGuildVerification();

  return (
    <div className="guild-page guild-page-narrow">
      <PageHeader
        description="Guild identity and leadership verification."
        eyebrow="GUILD"
        title="Settings"
      />

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
    </div>
  );
}
