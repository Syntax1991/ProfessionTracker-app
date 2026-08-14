import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { AuditTable } from "../components/AuditTable";
import { useGuildAudit } from "../hooks/useGuildAudit";

export function AuditPage() {
  const {
    members,
    isLoading,
    error,
    reload
  } = useRoster();

  const audit = useGuildAudit(
    () => {
      void reload();
    }
  );

  return (
    <div className="guild-page">
      <PageHeader
        description="Live item level, enchant and socket compliance from Blizzard."
        eyebrow="GUILD"
        title="Gear Audit"
      />

      <GuildVerificationGate>
        {(error || audit.error) && (
          <StatusMessage type="error">
            {error ??
              audit.error ??
              "Unknown error"}
          </StatusMessage>
        )}

        {audit.result && (
          <StatusMessage type="info">
            {`Audited ${audit.result.auditedMembers}/${audit.result.totalMembers} members${audit.result.skippedMembers > 0 ? ` (${audit.result.skippedMembers} skipped).` : "."}`}
          </StatusMessage>
        )}

        <div className="guild-section-toolbar">
          <div>
            <span className="eyebrow">
              AUDIT
            </span>

            <h2>
              {members.length} Members
            </h2>
          </div>

          <button
            className="button button-primary"
            disabled={
              audit.isRefreshing
            }
            onClick={() => {
              void audit.refresh();
            }}
            type="button"
          >
            {audit.isRefreshing
              ? "Refreshing…"
              : "Refresh from Blizzard"}
          </button>
        </div>

        <section className="panel guild-content-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                READINESS
              </p>

              <h2>
                Gear Compliance
              </h2>
            </div>
          </div>

          {isLoading ? (
            <LoadingPanel />
          ) : (
            <AuditTable
              members={members}
            />
          )}
        </section>
      </GuildVerificationGate>
    </div>
  );
}