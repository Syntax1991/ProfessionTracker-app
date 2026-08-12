import {
  Link
} from "react-router-dom";
import {
  ProfessionRecipeSimulation
} from "./ProfessionRecipeSimulation";
import type {
  ProfessionRecipeCatalogItem,
  ProfessionRecipeCrafter
} from "../types/professionRecipe.types";
import {
  getProfessionRecipeCraftStatusClassName,
  getProfessionRecipeCraftStatusLabel
} from "../utils/professionRecipeStatus";

type ProfessionRecipeDetailPanelProps = {
  recipe:
    ProfessionRecipeCatalogItem;
};

function formatModifier(
  value: number | null
): string {
  if (value === null) {
    return "–";
  }

  return value > 0
    ? `+${value}`
    : `${value}`;
}

function getOperationSkill(
  crafter:
    ProfessionRecipeCrafter
): number {
  return (
    crafter.operation
      .effectiveSkill ??
    crafter.effectiveSkill
  );
}

export function ProfessionRecipeDetailPanel({
  recipe
}: ProfessionRecipeDetailPanelProps) {
  return (
    <aside className="panel profession-recipe-detail">
      <header className="profession-recipe-detail-header">
        <div>
          <p className="eyebrow">
            RECIPE
          </p>

          <h3>
            {recipe.name}
          </h3>

          <span>
            {recipe.expansion}
            {" · #"}
            {recipe.gameRecipeId}
          </span>
        </div>

        <div className="profession-recipe-detail-statuses">
          <span
            className={
              getProfessionRecipeCraftStatusClassName(
                recipe.craftStatus
              )
            }
          >
            {
              getProfessionRecipeCraftStatusLabel(
                recipe.craftStatus
              )
            }
          </span>

          <span
            className={
              recipe.crafters.length > 0
                ? "profession-recipe-available"
                : "profession-recipe-missing"
            }
          >
            {recipe.crafters.length}
            {" Crafter"}
          </span>
        </div>
      </header>

      <div className="profession-recipe-detail-facts">
        <div>
          <span>
            Difficulty
          </span>

          <strong>
            {
              recipe.baseDifficulty ??
              "–"
            }
          </strong>
        </div>

        <div>
          <span>
            Operation Data
          </span>

          <strong>
            {
              recipe.operationCoverage
                .coveragePercent
            }
            {"%"}
          </strong>
        </div>
      </div>

      {recipe.capabilities.length >
        0 && (
        <div className="profession-recipe-detail-groups">
          {recipe.capabilities.map(
            (capability) => (
              <span
                key={
                  capability.id
                }
              >
                {capability.name}
              </span>
            )
          )}
        </div>
      )}

      <section className="profession-recipe-detail-crafters">
        <header>
          <h4>
            Crafter
          </h4>

          <span>
            {
              recipe.crafters.length
            }
          </span>
        </header>

        {recipe.crafters.length ===
        0 ? (
          <div className="profession-recipe-detail-empty">
            No captured character
            has learned this recipe.
          </div>
        ) : (
          <div className="profession-recipe-detail-crafter-list">
            {recipe.crafters.map(
              (crafter) => (
                <article
                  className="profession-recipe-detail-crafter"
                  key={
                    crafter.characterId
                  }
                >
                  <div className="profession-recipe-detail-crafter-header">
                    <div>
                      <strong>
                        {crafter.name}
                      </strong>

                      <span>
                        {crafter.className}
                        {" · "}
                        {crafter.realm}
                      </span>
                    </div>

                    <div className="profession-recipe-detail-crafter-actions">
                      <span
                        className={
                          getProfessionRecipeCraftStatusClassName(
                            crafter.craftStatus
                          )
                        }
                      >
                        {
                          getProfessionRecipeCraftStatusLabel(
                            crafter.craftStatus
                          )
                        }
                      </span>

                      <Link
                        to={
                          `/characters/${crafter.characterId}`
                        }
                      >
                        Details
                      </Link>
                    </div>
                  </div>

                  <div className="profession-recipe-operation-chips">
                    <span>
                      Base{" "}
                      {
                        crafter.operation
                          .baseSkill ??
                        crafter.skill
                      }
                    </span>

                    <span>
                      Bonus{" "}
                      {
                        formatModifier(
                          crafter.operation
                            .bonusSkill
                        )
                      }
                    </span>

                    <span>
                      Effective{" "}
                      {
                        getOperationSkill(
                          crafter
                        )
                      }
                    </span>

                    {crafter.operation
                      .craftingQuality !==
                      null && (
                      <span>
                        Q
                        {
                          crafter.operation
                            .craftingQuality
                        }
                      </span>
                    )}

                    {crafter.operation
                      .concentrationCost !==
                      null && (
                      <span>
                        Conc.{" "}
                        {
                          crafter.operation
                            .concentrationCost
                        }
                      </span>
                    )}
                  </div>

                  <ProfessionRecipeSimulation
                    simulation={
                      crafter.reagentSimulation
                    }
                    recommendation={
                      crafter.recommendation
                    }
                  />

                  <div className="profession-recipe-operation-meta">
                    <span
                      className={
                        crafter.operation
                          .status ===
                        "CAPTURED"
                          ? "captured"
                          : "missing"
                      }
                    >
                      {
                        crafter.operation
                          .status ===
                        "CAPTURED"
                          ? "Operation captured"
                          : "Operation missing"
                      }
                    </span>

                    <span>
                      KP{" "}
                      {
                        crafter
                          .knowledgePoints
                      }
                    </span>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </aside>
  );
}