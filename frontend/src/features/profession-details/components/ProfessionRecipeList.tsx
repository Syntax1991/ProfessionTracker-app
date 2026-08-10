import type {
  ProfessionRecipeCatalogItem
} from "../types/professionRecipe.types";
import {
  getProfessionRecipeCraftStatusClassName,
  getProfessionRecipeCraftStatusLabel
} from "../utils/professionRecipeStatus";

type ProfessionRecipeListProps = {
  recipes:
    ProfessionRecipeCatalogItem[];
  selectedRecipeId:
    string | null;
  onSelect:
    (
      recipeId: string
    ) => void;
};

function getPrimaryGroup(
  recipe:
    ProfessionRecipeCatalogItem
): string {
  const primary =
    recipe.capabilities.find(
      (capability) =>
        capability.isPrimary
    );

  return (
    primary?.name ??
    recipe.capabilities[0]
      ?.name ??
    "Ohne Gruppe"
  );
}

export function ProfessionRecipeList({
  recipes,
  selectedRecipeId,
  onSelect
}: ProfessionRecipeListProps) {
  return (
    <div className="profession-recipe-list-panel panel">
      <div className="profession-recipe-list-header">
        <span>
          Rezept
        </span>

        <span>
          Gruppe
        </span>

        <span>
          Diff.
        </span>

        <span>
          Crafter
        </span>

        <span>
          Status
        </span>
      </div>

      <div className="profession-recipe-list-scroll">
        {recipes.map(
          (recipe) => {
            const selected =
              recipe.id ===
              selectedRecipeId;

            return (
              <button
                className={
                  selected
                    ? "profession-recipe-list-row selected"
                    : "profession-recipe-list-row"
                }
                key={recipe.id}
                onClick={
                  () =>
                    onSelect(
                      recipe.id
                    )
                }
                type="button"
              >
                <span className="profession-recipe-list-name">
                  <strong>
                    {recipe.name}
                  </strong>

                  <small>
                    #{recipe.gameRecipeId}
                  </small>
                </span>

                <span className="profession-recipe-list-group">
                  {
                    getPrimaryGroup(
                      recipe
                    )
                  }
                </span>

                <span>
                  {
                    recipe.baseDifficulty ??
                    "–"
                  }
                </span>

                <span>
                  {
                    recipe.crafters.length
                  }
                </span>

                <span>
                  <small
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
                  </small>
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}