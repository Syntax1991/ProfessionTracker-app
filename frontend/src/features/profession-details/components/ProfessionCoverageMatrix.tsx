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
            SLOT COVERAGE
          </p>

          <h2>
            Craftable Slots
          </h2>
        </div>

        <p>
          Only actual
          Equipment-Slots wie Head, Chest,
          Wrist, Legs or Feet are shown.
        </p>
      </div>

      <div className="profession-coverage-matrix-grid">
        <ProfessionCoverageGroupList
          description="Each slot shows every character that currently covers it."
          emptyText="No actual equipment slots have been captured for this profession yet."
          groups={groups}
          title="Slots"
        />
      </div>
    </section>
  );
}