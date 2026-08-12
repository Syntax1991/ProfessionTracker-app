import type {
  ProfessionRecipeCrafterRecommendation,
  ProfessionRecipeReagentSelection
} from "../types/professionRecipe.types";

export function getProfessionRecipeRecommendationLabel(
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

export function getProfessionRecipeMaterialMixLabel(
  selections:
    ProfessionRecipeReagentSelection[]
): string | null {
  const qualityTotals =
    new Map<
      number,
      number
    >();

  for (
    const selection of
    selections
  ) {
    if (
      selection.quality === null ||
      selection.quantity <= 0
    ) {
      continue;
    }

    qualityTotals.set(
      selection.quality,
      (
        qualityTotals.get(
          selection.quality
        ) ??
        0
      ) +
        selection.quantity
    );
  }

  const labels =
    Array.from(
      qualityTotals.entries()
    )
      .sort(
        (
          [leftQuality],
          [rightQuality]
        ) =>
          leftQuality -
          rightQuality
      )
      .map(
        (
          [
            quality,
            quantity
          ]
        ) =>
          `${quantity}× Q${quality}`
      );

  return labels.length > 0
    ? labels.join(" · ")
    : null;
}

export function getProfessionRecipeMaterialRequirementLabel(
  recommendation:
    ProfessionRecipeCrafterRecommendation
): string {
  if (
    recommendation.kind ===
    "MINIMUM_MATS"
  ) {
    return (
      getProfessionRecipeMaterialMixLabel(
        recommendation.selections
      ) ??
      "Niedrigste ausreichende Mats"
    );
  }

  return getProfessionRecipeRecommendationLabel(
    recommendation
  );
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
      ? getProfessionRecipeMaterialMixLabel(
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
          getProfessionRecipeRecommendationLabel(
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