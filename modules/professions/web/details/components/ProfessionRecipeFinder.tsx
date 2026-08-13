import {
  useMemo,
  useState
} from "react";
import {
  LoadingPanel
} from "../../../../../apps/web/src/shared/components/LoadingPanel";
import {
  StatusMessage
} from "../../../../../apps/web/src/shared/components/StatusMessage";
import {
  useProfessionRecipes
} from "../hooks/useProfessionRecipes";
import type {
  ProfessionRecipeCatalogItem
} from "../types/professionRecipe.types";
import {
  ProfessionRecipeDetailPanel
} from "./ProfessionRecipeDetailPanel";
import {
  ProfessionRecipeList
} from "./ProfessionRecipeList";

type ProfessionRecipeFinderProps = {
  professionId: string;
};

export function ProfessionRecipeFinder({
  professionId
}: ProfessionRecipeFinderProps) {
  const {
    catalog,
    isLoading,
    error
  } =
    useProfessionRecipes(
      professionId
    );

  const [
    query,
    setQuery
  ] =
    useState(
      ""
    );

  const [
    onlyCraftable,
    setOnlyCraftable
  ] =
    useState(
      false
    );

  const [
    selectedRecipeId,
    setSelectedRecipeId
  ] =
    useState<
      string | null
    >(
      null
    );

  const filteredRecipes =
    useMemo(
      () => {
        if (!catalog) {
          return [];
        }

        return catalog.items.filter(
          (recipe) =>
            matchesFilters(
              recipe,
              query,
              onlyCraftable
            )
        );
      },
      [
        catalog,
        query,
        onlyCraftable
      ]
    );

  const selectedRecipe =
    filteredRecipes.find(
      (recipe) =>
        recipe.id ===
        selectedRecipeId
    ) ??
    filteredRecipes[0] ??
    null;

  return (
    <section className="profession-recipe-finder-section">
      <div className="profession-detail-section-heading">
        <div>
          <p className="eyebrow">
            RECIPES
          </p>

          <h2>
            Craft Catalog
          </h2>
        </div>

        <p>
          Browse the compact recipe
          list on the left and inspect
          the selected recipe on the
          right.
        </p>
      </div>

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {isLoading ? (
        <LoadingPanel />
      ) : catalog ? (
        <>
          <section className="panel profession-recipe-toolbar">
            <div className="profession-recipe-summary">
              <div>
                <span>
                  Catalog
                </span>

                <strong>
                  {
                    catalog.summary
                      .catalogRecipeCount
                  }
                </strong>
              </div>

              <div>
                <span>
                  Craftable
                </span>

                <strong>
                  {
                    catalog.summary
                      .craftableRecipeCount
                  }
                </strong>
              </div>

              <div>
                <span>
                  Missing
                </span>

                <strong>
                  {
                    catalog.summary
                      .missingRecipeCount
                  }
                </strong>
              </div>

              <div>
                <span>
                  Data
                </span>

                <strong>
                  {
                    catalog.summary
                      .operationCoveragePercent
                  }
                  {"%"}
                </strong>
              </div>
            </div>

            <div className="profession-recipe-filters">
              <label>
                <span>
                  Search
                </span>

                <input
                  onChange={
                    (event) =>
                      setQuery(
                        event.target.value
                      )
                  }
                  placeholder="Recipe, group or character..."
                  type="search"
                  value={query}
                />
              </label>

              <label className="profession-recipe-toggle">
                <input
                  checked={
                    onlyCraftable
                  }
                  onChange={
                    (event) =>
                      setOnlyCraftable(
                        event.target.checked
                      )
                  }
                  type="checkbox"
                />

                <span>
                  Craftable only
                </span>
              </label>
            </div>
          </section>

          <div className="profession-recipe-result-heading">
            <strong>
              {filteredRecipes.length}
            </strong>

            <span>
              {
                filteredRecipes.length ===
                1
                  ? " matching recipe"
                  : " matching recipes"
              }
            </span>
          </div>

          {filteredRecipes.length ===
          0 ? (
            <section className="panel">
              <div className="empty-state">
                No recipes match this
                filter.
              </div>
            </section>
          ) : (
            <div className="profession-recipe-browser">
              <ProfessionRecipeList
                onSelect={
                  setSelectedRecipeId
                }
                recipes={
                  filteredRecipes
                }
                selectedRecipeId={
                  selectedRecipe?.id ??
                  null
                }
              />

              {selectedRecipe && (
                <ProfessionRecipeDetailPanel
                  recipe={
                    selectedRecipe
                  }
                />
              )}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}

function matchesFilters(
  recipe:
    ProfessionRecipeCatalogItem,
  query: string,
  onlyCraftable: boolean
): boolean {
  if (
    onlyCraftable &&
    recipe.crafters.length ===
      0
  ) {
    return false;
  }

  const normalizedQuery =
    query
      .trim()
      .toLocaleLowerCase(
        "en"
      );

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    recipe.name,
    recipe.expansion,
    ...recipe.capabilities.map(
      (capability) =>
        capability.name
    ),
    ...recipe.crafters.map(
      (crafter) =>
        crafter.name
    ),
    ...recipe.crafters.map(
      (crafter) =>
        crafter.realm
    )
  ];

  return searchableValues.some(
    (value) =>
      value
        .toLocaleLowerCase(
          "en"
        )
        .includes(
          normalizedQuery
        )
  );
}