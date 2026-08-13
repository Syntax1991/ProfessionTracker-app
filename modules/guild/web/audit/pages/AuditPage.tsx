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
    <>
      <PageHeader
        description="Live item level, enchant and socket compliance pulled straight from Blizzard for every roster member."
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
            {`Audited ${audit.result.auditedMembers}/${audit.result.totalMembers} members${
              audit.result
                .skippedMembers > 0
                ? ` (${audit.result.skippedMembers} skipped — no matching Blizzard character or unresolved realm).`
                : "."
            }`}
          </StatusMessage>
        )}

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                OVERVIEW
              </p>

              <h2>
                {members.length}{" "}
                Guild Members
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

          {isLoading ? (
            <LoadingPanel />
          ) : (
            <AuditTable
              members={members}
            />
          )}
        </section>
      </GuildVerificationGate>
    </>
  );
}
