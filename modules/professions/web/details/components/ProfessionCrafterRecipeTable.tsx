import type {
  ProfessionRecipeCatalogItem,
  ProfessionRecipeCrafter
} from "../types/professionRecipe.types";
import {
  getProfessionRecipeMaterialRequirementLabel
} from "../utils/professionRecipeRecommendation";
import {
  getProfessionRecipeProductLabel
} from "../utils/professionRecipePresentation";
import {
  getProfessionRecipeCraftStatusClassName
} from "../utils/professionRecipeStatus";

export type ProfessionCrafterRecipeEntry = {
  recipe:
    ProfessionRecipeCatalogItem;
  crafter:
    ProfessionRecipeCrafter;
  group: string;
};

function getStatusLabel(
  entry:
    ProfessionCrafterRecipeEntry
): string {
  switch (
    entry.crafter.craftStatus
  ) {
    case "SAFE":
      return "SAFE";

    case "CONCENTRATION":
      return "CONC.";

    case "NOT_SAFE":
      return "NOT SAFE";

    case "UNKNOWN":
      return "UNKNOWN";
  }
}

function getResultLabel(
  entry:
    ProfessionCrafterRecipeEntry
): string {
  const recommendation =
    entry.crafter
      .recommendation;

  const parts: string[] =
    [];

  if (
    recommendation
      .craftingQuality !==
    null
  ) {
    parts.push(
      `Q${recommendation.craftingQuality}`
    );
  }

  if (
    recommendation
      .effectiveSkill !==
    null
  ) {
    parts.push(
      `Skill ${recommendation.effectiveSkill}`
    );
  }

  return parts.length > 0
    ? parts.join(" · ")
    : "–";
}

function groupEntries(
  entries:
    ProfessionCrafterRecipeEntry[]
): Array<{
  name: string;
  entries:
    ProfessionCrafterRecipeEntry[];
}> {
  const groups =
    new Map<
      string,
      ProfessionCrafterRecipeEntry[]
    >();

  for (const entry of entries) {
    const current =
      groups.get(
        entry.group
      ) ?? [];

    current.push(
      entry
    );

    groups.set(
      entry.group,
      current
    );
  }

  return Array.from(
    groups.entries()
  )
    .map(
      (
        [
          name,
          groupedEntries
        ]
      ) => ({
        name,
        entries:
          groupedEntries.sort(
            (left, right) =>
              left.recipe.name
                .localeCompare(
                  right.recipe.name,
                  "en"
                )
          )
      })
    )
    .sort(
      (left, right) =>
        left.name.localeCompare(
          right.name,
          "en"
        )
    );
}

export function ProfessionCrafterRecipeTable({
  entries
}: {
  entries:
    ProfessionCrafterRecipeEntry[];
}) {
  if (entries.length === 0) {
    return (
      <section className="panel">
        <div className="empty-state">
          No recipes match this
          filter.
        </div>
      </section>
    );
  }

  const groups =
    groupEntries(
      entries
    );

  return (
    <div className="profession-crafter-recipe-groups">
      {groups.map(
        (group) => (
          <section
            className="panel profession-crafter-recipe-group"
            key={group.name}
          >
            <header className="profession-crafter-recipe-group-header">
              <div>
                <h3>
                  {group.name}
                </h3>

                <span>
                  {
                    group.entries
                      .length
                  }
                  {
                    group.entries
                      .length === 1
                      ? " recipe"
                      : " recipes"
                  }
                </span>
              </div>
            </header>

            <div className="profession-crafter-recipe-table-header">
              <span>
                Recipe
              </span>

              <span>
                Type
              </span>

              <span>
                Status
              </span>

              <span>
                Safe Materials
              </span>

              <span>
                Result
              </span>
            </div>

            <div className="profession-crafter-recipe-rows">
              {group.entries.map(
                (entry) => (
                  <article
                    className="profession-crafter-recipe-row"
                    key={
                      entry.recipe.id
                    }
                  >
                    <div className="profession-crafter-recipe-name">
                      <strong>
                        {
                          entry.recipe
                            .name
                        }
                      </strong>
                    </div>

                    <span className="profession-crafter-product-type">
                      {
                        getProfessionRecipeProductLabel(
                          entry.recipe
                        )
                      }
                    </span>

                    <span
                      className={
                        getProfessionRecipeCraftStatusClassName(
                          entry.crafter
                            .craftStatus
                        )
                      }
                    >
                      {
                        getStatusLabel(
                          entry
                        )
                      }
                    </span>

                    <strong className="profession-crafter-materials">
                      {
                        getProfessionRecipeMaterialRequirementLabel(
                          entry.crafter
                            .recommendation
                        )
                      }
                    </strong>

                    <span className="profession-crafter-result">
                      {
                        getResultLabel(
                          entry
                        )
                      }
                    </span>
                  </article>
                )
              )}
            </div>
          </section>
        )
      )}
    </div>
  );
}