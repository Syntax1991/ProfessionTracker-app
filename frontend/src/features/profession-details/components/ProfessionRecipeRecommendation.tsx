import type {
  ProfessionRecipeCrafterRecommendation,
  ProfessionRecipeReagentSelection
} from "../types/professionRecipe.types";

function getRecommendationLabel(
  recommendation:
    ProfessionRecipeCrafterRecommendation
): string {
  switch (recommendation.kind) {
    case "LOW_MATS":
      return "Low Mats reichen";

    case "MINIMUM_MATS":
      return "Niedrigste ausreichende Mats";

    case "HIGH_MATS":
      return "High Mats";

    case "HIGH_MATS_CONCENTRATION":
      return recommendation
        .concentrationCost === null
        ? "High Mats + Konzentration"
        : `High Mats + ${recommendation.concentrationCost} Konz.`;

    case "NOT_REACHABLE":
      return "Mit High Mats nicht erreichbar";

    case "UNKNOWN":
      return "Noch keine Empfehlung";
  }
}

function compareSelections(
  left: ProfessionRecipeReagentSelection,
  right: ProfessionRecipeReagentSelection
): number {
  return (
    left.slotIndex -
      right.slotIndex ||
    left.dataSlotIndex -
      right.dataSlotIndex ||
    left.candidateIndex -
      right.candidateIndex
  );
}

function getMaterialMixLabel(
  selections:
    ProfessionRecipeReagentSelection[]
): string | null {
  const labels =
    [...selections]
      .sort(
        compareSelections
      )
      .filter(
        (selection) =>
          selection.quality !== null &&
          selection.quantity > 0
      )
      .map(
        (selection) =>
          `${selection.quantity}× Q${selection.quality}`
      );

  return labels.length > 0
    ? labels.join(" · ")
    : null;
}

export function ProfessionRecipeRecommendation({
  recommendation
}: {
  recommendation:
    ProfessionRecipeCrafterRecommendation;
}) {
  if (
    recommendation.kind ===
    "UNKNOWN"
  ) {
    return null;
  }

  const materialMix =
    recommendation.kind ===
      "MINIMUM_MATS"
      ? getMaterialMixLabel(
        recommendation.selections
      )
      : null;

  return (
    <div className="profession-recipe-recommendation">
      <span>
        Empfehlung
      </span>

      <strong>
        {
          getRecommendationLabel(
            recommendation
          )
        }
      </strong>

      {materialMix && (
        <small>
          {materialMix}
        </small>
      )}

      {recommendation.craftingQuality !==
        null && (
        <small>
          Q
          {
            recommendation
              .craftingQuality
          }
          {recommendation.effectiveSkill !==
            null && (
            <>
              {" · Skill "}
              {
                recommendation
                  .effectiveSkill
              }
            </>
          )}
        </small>
      )}
    </div>
  );
}