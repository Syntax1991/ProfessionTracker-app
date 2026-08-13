import {
  Link
} from "react-router-dom";
import type {
  ProfessionRecipeBaselineStatus,
  ProfessionRecipeCatalogItem,
  ProfessionRecipeCrafter
} from "../types/professionRecipe.types";

type ProfessionRecipeCardProps = {
  recipe:
    ProfessionRecipeCatalogItem;
};

function formatModifier(
  value: number
): string {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}

function getReadinessLabel(
  crafter:
    ProfessionRecipeCrafter
): string {
  switch (
    crafter.baselineStatus
  ) {
    case "BASE_SKILL_SUFFICIENT":
      if (
        crafter.baselineSkillSurplus !==
          null &&
        crafter.baselineSkillSurplus >
          0
      ) {
        return (
          `Base skill sufficient · +${crafter.baselineSkillSurplus} surplus`
        );
      }

      return "Base skill sufficient";

    case "RECIPE_BONUS_REQUIRED":
      if (
        crafter.baselineSkillGap !==
        null
      ) {
        return (
          `${crafter.baselineSkillGap} skill missing before recipe bonuses`
        );
      }

      return "Recipe bonuses required";

    case "UNKNOWN":
      return "Baseline check pending";
  }
}

function getReadinessClass(
  status:
    ProfessionRecipeBaselineStatus
): string {
  switch (status) {
    case "BASE_SKILL_SUFFICIENT":
      return "sufficient";

    case "RECIPE_BONUS_REQUIRED":
      return "bonus-required";

    case "UNKNOWN":
      return "unknown";
  }
}

export function ProfessionRecipeCard({
  recipe
}: ProfessionRecipeCardProps) {
  return (
    <article className="panel profession-recipe-card">
      <header className="profession-recipe-card-header">
        <div>
          <h3>
            {recipe.name}
          </h3>

          <p>
            {recipe.expansion}
            {" · Recipe #"}
            {recipe.gameRecipeId}
          </p>
        </div>

        <span
          className={
            recipe.crafters.length >
            0
              ? "profession-recipe-available"
              : "profession-recipe-missing"
          }
        >
          {recipe.crafters.length >
          0
            ? `${recipe.crafters.length} ${
                recipe.crafters.length === 1
                  ? "crafter"
                  : "crafters"
              }`
            : "No crafter"}
        </span>
      </header>

      <div className="profession-recipe-card-body">
        <section>
          <h4>
            Groups
          </h4>

          {recipe.capabilities.length ===
          0 ? (
            <p className="profession-recipe-empty">
              Not assigned to a
              crafting group yet.
            </p>
          ) : (
            <div className="profession-recipe-tags">
              {recipe.capabilities.map(
                (capability) => (
                  <span
                    key={
                      capability.id
                    }
                  >
                    {
                      capability.name
                    }
                  </span>
                )
              )}
            </div>
          )}
        </section>

        <section>
          <h4>
            Base Difficulty
          </h4>

          <p className="profession-recipe-difficulty">
            {recipe.baseDifficulty ===
            null
              ? "Not captured yet"
              : recipe.baseDifficulty}
          </p>
        </section>
      </div>

      <div className="profession-recipe-baseline-note">
        Baseline check: Compares only
        effective profession skill and
        base difficulty. This is not a
        final safe-craft status.
      </div>

      <section className="profession-recipe-crafters">
        <header>
          <h4>
            Who can craft this?
          </h4>
        </header>

        {recipe.crafters.length ===
        0 ? (
          <div className="profession-recipe-empty">
            None of your captured
            characters has learned
            this recipe.
          </div>
        ) : (
          <ul>
            {recipe.crafters.map(
              (crafter) => (
                <li
                  key={
                    crafter.characterId
                  }
                >
                  <Link
                    to={
                      `/characters/${crafter.characterId}`
                    }
                  >
                    <div className="profession-recipe-crafter-identity">
                      <strong>
                        {crafter.name}
                      </strong>

                      <span>
                        {crafter.className}
                        {" · "}
                        {crafter.realm}
                      </span>

                      <small
                        className={
                          `profession-recipe-readiness ${getReadinessClass(crafter.baselineStatus)}`
                        }
                      >
                        {
                          getReadinessLabel(
                            crafter
                          )
                        }
                      </small>
                    </div>

                    <div className="profession-recipe-crafter-stats">
                      <span>
                        Base
                        {" "}
                        {crafter.skill}
                      </span>

                      <span>
                        Bonus
                        {" "}
                        {
                          formatModifier(
                            crafter.skillModifier
                          )
                        }
                      </span>

                      <span>
                        Effective
                        {" "}
                        {
                          crafter.effectiveSkill
                        }
                      </span>

                      <span>
                        KP
                        {" "}
                        {
                          crafter.knowledgePoints
                        }
                      </span>
                    </div>
                  </Link>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </article>
  );
}