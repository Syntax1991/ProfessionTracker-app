import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { RaiderLinkPanel } from "../components/RaiderLinkPanel";
import { useRaiderLink } from "../hooks/useRaiderLink";

export function RaiderLinkPage() {
  const raiderLink = useRaiderLink();

  return (
    <>
      <PageHeader
        description="Sign in with your own Battle.net account to manage your own raid signups."
        eyebrow="GUILD"
        title="My Raider Login"
      />

      {raiderLink.error && (
        <StatusMessage type="error">
          {raiderLink.error}
        </StatusMessage>
      )}

      <RaiderLinkPanel
        isClaiming={
          raiderLink.isClaiming
        }
        isLoading={
          raiderLink.isLoading
        }
        isLoggedIn={
          raiderLink.isLoggedIn
        }
        onClaim={(memberId) => {
          void raiderLink.claim(
            memberId
          );
        }}
        onLogout={() => {
          void raiderLink.logout();
        }}
        resolution={
          raiderLink.resolution
        }
      />
    </>
  );
}
