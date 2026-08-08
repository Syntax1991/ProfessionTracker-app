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
            Synchronisierung abgeschlossen
          </h2>
        </div>

        <span className="integration-badge configured">
          Erfolgreich
        </span>
      </div>

      <div className="import-result-grid">
        <div>
          <span>
            Charaktere
          </span>

          <strong>
            {result.processed.characters}
          </strong>
        </div>

        <div>
          <span>
            Berufe
          </span>

          <strong>
            {result.processed.professionAssignments}
          </strong>
        </div>

        <div>
          <span>
            Fortschritte
          </span>

          <strong>
            {result.processed.progressEntries}
          </strong>
        </div>
      </div>

      <div className="addon-result-meta">
        <span>
          {result.processed.catalogs} Kataloge
        </span>

        <span>
          {result.processed.trees} Spezialisierungsbäume
        </span>

        <span>
          {result.processed.specializationNodes} Knoten
        </span>
      </div>

      <div className="integration-actions">
        <Link
          className="button button-primary"
          to="/characters"
        >
          Charaktere ansehen
        </Link>
      </div>
    </section>
  );
}