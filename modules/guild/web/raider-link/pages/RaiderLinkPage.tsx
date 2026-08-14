import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { RaiderLinkPanel } from "../components/RaiderLinkPanel";
import { useRaiderLink } from "../hooks/useRaiderLink";

export function RaiderLinkPage() {
  const raiderLink = useRaiderLink();

  return (
    <div className="guild-page guild-page-narrow">
      <PageHeader
        description="Link your Battle.net identity to your guild roster entry."
        eyebrow="GUILD"
        title="My Raider Login"
      />

      {raiderLink.error && (
        <StatusMessage type="error">
          {raiderLink.error}
        </StatusMessage>
      )}

      <div className="guild-section-toolbar">
        <div>
          <span className="eyebrow">
            ACCOUNT
          </span>

          <h2>
            Raider Identity
          </h2>
        </div>
      </div>

      <RaiderLinkPanel
        isClaiming={
          raiderLink.isClaiming
        }
        isLoading={
          raiderLink.isLoading
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
    </div>
  );
}