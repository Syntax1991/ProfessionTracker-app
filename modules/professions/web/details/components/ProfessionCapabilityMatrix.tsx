import {
  useMemo
} from "react";
import type {
  ProfessionDetail
} from "../types/professionDetail.types";
import {
  createProfessionCapabilityGroups
} from "../utils/professionCapabilityGroups";
import {
  ProfessionCapabilityGroupList
} from "./ProfessionCapabilityGroupList";

type ProfessionCapabilityMatrixProps = {
  detail:
    ProfessionDetail;
};

export function ProfessionCapabilityMatrix({
  detail
}: ProfessionCapabilityMatrixProps) {
  const groups =
    useMemo(
      () =>
        createProfessionCapabilityGroups(
          detail
        ),
      [detail]
    );

  return (
    <section className="profession-coverage-matrix-section">
      <div className="profession-detail-section-heading">
        <div>
          <p className="eyebrow">
            WHO CAN CRAFT WHAT?
          </p>

          <h2>
            Crafting Capabilities
          </h2>
        </div>

        <p>
          Groups are derived from the
          recipes actually learned by
          your characters. This shows
          which crafter covers which
          product or recipe group
          abdeckt.
        </p>
      </div>

      <ProfessionCapabilityGroupList
        groups={groups}
      />
    </section>
  );
}