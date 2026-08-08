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
            SLOTABDECKUNG
          </p>

          <h2>
            Herstellbare Slots
          </h2>
        </div>

        <p>
          Angezeigt werden nur tatsächliche
          Equipment-Slots wie Head, Chest,
          Wrist, Legs oder Feet.
        </p>
      </div>

      <div className="profession-coverage-matrix-grid">
        <ProfessionCoverageGroupList
          description="Pro Slot siehst du alle Charaktere, die ihn aktuell abdecken."
          emptyText="Für diesen Beruf wurden noch keine tatsächlichen Equipment-Slots erfasst."
          groups={groups}
          title="Slots"
        />
      </div>
    </section>
  );
}