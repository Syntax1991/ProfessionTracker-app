import type {
  ProfessionRecipeCrafterRecommendation
} from "../types/professionRecipe.types";
import {
  getProfessionRecipeMaterialMixLabel,
  getProfessionRecipeRecommendationLabel
} from "../utils/professionRecipeRecommendation";

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
        Recommendation
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