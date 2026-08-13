import { Link } from "react-router-dom";
import type {
  AddonImportResult
} from "../types/addon.types";

type AddonImportResultPanelProps = {
  result: AddonImportResult;
};

export function AddonImportResultPanel({
  result
}: AddonImportResultPanelProps) {
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
            Characters
          </span>

          <strong>
            {result.processed.characters}
          </strong>
        </div>

        <div>
          <span>
            Professions
          </span>

          <strong>
            {result.processed.professionAssignments}
          </strong>
        </div>

        <div>
          <span>
            Progress Entries
          </span>

          <strong>
            {result.processed.progressEntries}
          </strong>
        </div>
      </div>

      <div className="addon-result-meta">
        <span>
          {result.processed.catalogs} Catalogs
        </span>

        <span>
          {result.processed.trees} Specialization Trees
        </span>

        <span>
          {result.processed.specializationNodes} Nodes
        </span>
      </div>

      <div className="integration-actions">
        <Link
          className="button button-primary"
          to="/characters"
        >
          View characters
        </Link>
      </div>
    </section>
  );
}