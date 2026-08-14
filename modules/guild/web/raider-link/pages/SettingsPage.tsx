import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { RaiderLinkPanel } from "../components/RaiderLinkPanel";
import { useRaiderLink } from "../hooks/useRaiderLink";

export function SettingsPage() {
  const raiderLink = useRaiderLink();

  return (
    <div className="guild-page guild-page-narrow">
      <PageHeader
        description="Your Battle.net identity and personal account preferences."
        eyebrow="ACCOUNT"
        title="Settings"
      />

      {raiderLink.error && (
        <StatusMessage type="error">
          {raiderLink.error}
        </StatusMessage>
      )}

      <div className="guild-section-toolbar">
        <div>
          <span className="eyebrow">
            IDENTITY
          </span>

          <h2>
            Raider Login
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
