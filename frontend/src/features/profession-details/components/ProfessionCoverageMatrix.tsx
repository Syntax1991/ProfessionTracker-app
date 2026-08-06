import {
  useMemo
} from "react";
import type { ProfessionDetail } from "../types/professionDetail.types";
import { createProfessionCoverageGroups } from "../utils/professionCoverageGroups";
import { ProfessionCoverageGroupList } from "./ProfessionCoverageGroupList";

type ProfessionCoverageMatrixProps = {
  detail:
    ProfessionDetail;
};

export function ProfessionCoverageMatrix({
  detail
}: ProfessionCoverageMatrixProps) {
  const groups =
    useMemo(
      () =>
        createProfessionCoverageGroups(
          detail
        ),
      [detail]
    );

  return (
    <section className="profession-coverage-matrix-section">
      <div className="profession-detail-section-heading">
        <div>
          <p className="eyebrow">
            WER KANN WAS?
          </p>

          <h2>
            Berufsabdeckung
          </h2>
        </div>

        <p>
          Spezialisierungen und Slots werden
          nach den Charakteren gruppiert, die
          sie aktuell abdecken.
        </p>
      </div>

      <div className="profession-coverage-matrix-grid">
        <ProfessionCoverageGroupList
          description="Aktive Spezialisierungspfade und die zugehörigen Charaktere."
          emptyText="Für diesen Beruf wurden noch keine Spezialisierungen erfasst."
          groups={
            groups.specializations
          }
          title="Spezialisierungen"
        />

        <ProfessionCoverageGroupList
          description="Herstellbare Slots und alle Charaktere, die den Slot abdecken."
          emptyText="Für diesen Beruf wurden noch keine herstellbaren Slots erfasst."
          groups={
            groups.slots
          }
          title="Herstellbare Slots"
        />
      </div>
    </section>
  );
}