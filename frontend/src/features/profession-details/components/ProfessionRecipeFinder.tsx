import {
  useMemo,
  useState
} from "react";
import {
  LoadingPanel
} from "../../../shared/components/LoadingPanel";
import {
  StatusMessage
} from "../../../shared/components/StatusMessage";
import {
  useProfessionRecipes
} from "../hooks/useProfessionRecipes";
import type {
  ProfessionRecipeCatalogItem
} from "../types/professionRecipe.types";
import {
  ProfessionRecipeCard
} from "./ProfessionRecipeCard";

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

  return (
    <section className="profession-recipe-finder-section">
      <div className="profession-detail-section-heading">
        <div>
          <p className="eyebrow">
            REZEPT FINDER
          </p>

          <h2>
            Wer kann diesen Craft?
          </h2>
        </div>

        <p>
          Suche nach Rezept,
          Craft-Gruppe oder Charakter.
          Fehlende Rezepte bleiben
          sichtbar, damit du Lücken in
          deiner Account-Abdeckung
          erkennst.
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
                  Katalog
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
                  Abgedeckt
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
                  Fehlend
                </span>

                <strong>
                  {
                    catalog.summary
                      .missingRecipeCount
                  }
                </strong>
              </div>
            </div>

            <div className="profession-recipe-filters">
              <label>
                <span>
                  Suche
                </span>

                <input
                  onChange={
                    (event) =>
                      setQuery(
                        event.target.value
                      )
                  }
                  placeholder="Rezept, Gruppe oder Charakter..."
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
                  Nur vorhandene Crafter
                </span>
              </label>
            </div>
          </section>

          <div className="profession-recipe-result-heading">
            <strong>
              {filteredRecipes.length}
            </strong>

            <span>
              {" passende Rezepte"}
            </span>
          </div>

          {filteredRecipes.length ===
          0 ? (
            <section className="panel">
              <div className="empty-state">
                Keine Rezepte passen zu
                diesem Filter.
              </div>
            </section>
          ) : (
            <div className="profession-recipe-grid">
              {filteredRecipes.map(
                (recipe) => (
                  <ProfessionRecipeCard
                    key={
                      recipe.id
                    }
                    recipe={
                      recipe
                    }
                  />
                )
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
        "de"
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
          "de"
        )
        .includes(
          normalizedQuery
        )
  );
}