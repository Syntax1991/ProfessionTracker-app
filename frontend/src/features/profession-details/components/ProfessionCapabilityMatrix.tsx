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
            WAS KANN WER?
          </p>

          <h2>
            Craft-Fähigkeiten
          </h2>
        </div>

        <p>
          Die Gruppen entstehen aus den
          tatsächlich gelernten Rezepten
          deiner Charaktere. So siehst du
          direkt, welcher Crafter welche
          Produkt- oder Rezeptgruppe
          abdeckt.
        </p>
      </div>

      <ProfessionCapabilityGroupList
        groups={groups}
      />
    </section>
  );
}