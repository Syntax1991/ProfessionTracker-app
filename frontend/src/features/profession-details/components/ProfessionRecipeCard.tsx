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
          `Grundskill reicht · +${crafter.baselineSkillSurplus} Reserve`
        );
      }

      return "Grundskill reicht";

    case "RECIPE_BONUS_REQUIRED":
      if (
        crafter.baselineSkillGap !==
        null
      ) {
        return (
          `${crafter.baselineSkillGap} Skill vor Rezeptboni offen`
        );
      }

      return "Rezeptboni erforderlich";

    case "UNKNOWN":
      return "Basischeck offen";
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
            ? `${recipe.crafters.length} Crafter`
            : "Kein Crafter"}
        </span>
      </header>

      <div className="profession-recipe-card-body">
        <section>
          <h4>
            Gruppen
          </h4>

          {recipe.capabilities.length ===
          0 ? (
            <p className="profession-recipe-empty">
              Noch keiner Craft-Gruppe
              zugeordnet.
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
            Grundschwierigkeit
          </h4>

          <p className="profession-recipe-difficulty">
            {recipe.baseDifficulty ===
            null
              ? "Noch nicht erfasst"
              : recipe.baseDifficulty}
          </p>
        </section>
      </div>

      <div className="profession-recipe-baseline-note">
        Basischeck: Vergleicht nur
        effektiven Berufsskill und
        Grundschwierigkeit. Das ist noch
        kein finaler Safe-Craft-Status.
      </div>

      <section className="profession-recipe-crafters">
        <header>
          <h4>
            Wer kann diesen Craft?
          </h4>
        </header>

        {recipe.crafters.length ===
        0 ? (
          <div className="profession-recipe-empty">
            Aktuell besitzt keiner deiner
            erfassten Charaktere dieses
            Rezept.
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
                        Basis
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
                        Effektiv
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