import {
  useEffect,
  useState
} from "react";
import {
  getProfessionRecipes
} from "../api/professionDetailApi";
import type {
  ProfessionRecipeCatalog
} from "../types/professionRecipe.types";

type ProfessionRecipeState = {
  catalog:
    ProfessionRecipeCatalog | null;
  isLoading: boolean;
  error: string | null;
};

export function useProfessionRecipes(
  professionId: string
): ProfessionRecipeState {
  const [
    catalog,
    setCatalog
  ] =
    useState<
      ProfessionRecipeCatalog | null
    >(
      null
    );

  const [
    isLoading,
    setIsLoading
  ] =
    useState(
      true
    );

  const [
    error,
    setError
  ] =
    useState<
      string | null
    >(
      null
    );

  useEffect(
    () => {
      let cancelled =
        false;

      async function load() {
        setIsLoading(
          true
        );

        setError(
          null
        );

        try {
          const result =
            await getProfessionRecipes(
              professionId
            );

          if (!cancelled) {
            setCatalog(
              result
            );
          }
        }
        catch (loadError) {
          if (!cancelled) {
            setCatalog(
              null
            );

            setError(
              loadError instanceof Error
                ? loadError.message
                : "Rezeptkatalog konnte nicht geladen werden."
            );
          }
        }
        finally {
          if (!cancelled) {
            setIsLoading(
              false
            );
          }
        }
      }

      void load();

      return () => {
        cancelled =
          true;
      };
    },
    [
      professionId
    ]
  );

  return {
    catalog,
    isLoading,
    error
  };
}