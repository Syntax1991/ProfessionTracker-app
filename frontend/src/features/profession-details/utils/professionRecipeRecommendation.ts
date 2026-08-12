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
      return (
        "Low-quality materials are sufficient"
      );

    case "MINIMUM_MATS":
      return (
        "Minimum sufficient materials"
      );

    case "HIGH_MATS":
      return (
        "Highest-quality materials"
      );

    case "HIGH_MATS_CONCENTRATION":
      return recommendation
        .concentrationCost === null
        ? "Highest-quality materials + Concentration"
        : `Highest-quality materials + ${recommendation.concentrationCost} Conc.`;

    case "NOT_REACHABLE":
      return (
        "Not reachable with highest-quality materials"
      );

    case "UNKNOWN":
      return "No recommendation yet";
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
      "Minimum sufficient materials"
    );
  }

  return getProfessionRecipeRecommendationLabel(
    recommendation
  );
}