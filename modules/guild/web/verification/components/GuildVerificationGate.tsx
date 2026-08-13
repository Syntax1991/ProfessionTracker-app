import type { ReactNode } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useGuildVerification } from "../hooks/useGuildVerification";
import { GuildVerificationPanel } from "./GuildVerificationPanel";
import { GuildVerificationStatusCard } from "./GuildVerificationStatusCard";

type GuildVerificationGateProps = {
  children: ReactNode;
};

/**
 * Wraps any Guild capability whose mutations require a verified guild
 * leadership link (Roster, Teams, ...). Renders the verification flow
 * until a valid link exists, then renders children below the status
 * card. Read-only views may render outside this gate if they don't
 * need to be blocked.
 */
export function GuildVerificationGate({
  children
}: GuildVerificationGateProps) {
  const verification =
    useGuildVerification();

  if (verification.isLoadingStatus) {
    return <LoadingPanel />;
  }

  return (
    <>
      {verification.error && (
        <StatusMessage type="error">
          {verification.error}
        </StatusMessage>
      )}

      {verification.status
        ?.verified ? (
        <GuildVerificationStatusCard
          isClearing={
            verification.isClearing
          }
          onClear={() => {
            void verification.clear();
          }}
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
          isVerifying={
            verification.isVerifying
          }
          onLoadCandidates={() => {
            void verification.loadCandidates();
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

      {verification.status
        ?.verified && children}
    </>
  );
}
