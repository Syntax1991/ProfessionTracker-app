import {
  useEffect,
  useState
} from "react";
import { getProfessionOverview } from "../api/professionDetailApi";
import type { ProfessionOverviewItem } from "../types/professionDetail.types";

type ProfessionOverviewState = {
  items: ProfessionOverviewItem[];
  isLoading: boolean;
  error: string | null;
};

export function useProfessionOverview():
  ProfessionOverviewState {
  const [items, setItems] =
    useState<
      ProfessionOverviewItem[]
    >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      setIsLoading(true);

      try {
        const result =
          await getProfessionOverview();

        if (!cancelled) {
          setItems(
            result.items
          );
        }
      }
      catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Berufsübersicht konnte nicht geladen werden."
          );
        }
      }
      finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    items,
    isLoading,
    error
  };
}