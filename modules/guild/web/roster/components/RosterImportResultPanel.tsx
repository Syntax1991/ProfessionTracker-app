import type {
  GuildRosterImportResult
} from "../types/rosterImport.types";

type RosterImportResultPanelProps = {
  result: GuildRosterImportResult;
};

export function RosterImportResultPanel({
  result
}: RosterImportResultPanelProps) {
  return (
    <section className="panel import-result addon-result-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            IMPORT
          </p>

          <h2>
            Sync complete
          </h2>
        </div>

        <span className="integration-badge configured">
          Successful
        </span>
      </div>

      <div className="import-result-grid">
        <div>
          <span>
            Members in snapshot
          </span>

          <strong>
            {result.processed.members}
          </strong>
        </div>

        <div>
          <span>
            Created
          </span>

          <strong>
            {result.processed.created}
          </strong>
        </div>

        <div>
          <span>
            Updated
          </span>

          <strong>
            {result.processed.updated}
          </strong>
        </div>
      </div>

      <div className="addon-result-meta">
        <span>
          Addon {result.addonVersion}
        </span>

        <span>
          Schema {result.schemaVersion}
        </span>
      </div>
    </section>
  );
}
