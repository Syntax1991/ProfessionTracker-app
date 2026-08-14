import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { AuditTable } from "./AuditTable";
import { useGuildAudit } from "../hooks/useGuildAudit";
import { useGuildGearSlots } from "../hooks/useGuildGearSlots";

export function GearOverviewTab() {
  const {
    members,
    isLoading,
    error,
    reload
  } = useRoster();

  const gearSlots =
    useGuildGearSlots();

  const audit = useGuildAudit(
    () => {
      void reload();
      void gearSlots.reload();
    }
  );

  return (
    <>
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
    </>
  );
}
