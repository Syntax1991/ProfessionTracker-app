import {
  useCallback,
  useEffect,
  useState
} from "react";
import { getProfessions } from "../api/professionApi";
import type { Profession } from "../types/profession.types";

type ProfessionState = {
  professions: Profession[];
  isLoading: boolean;
  error: string | null;
};

export function useProfessions():
  ProfessionState {
  const [professions, setProfessions] =
    useState<Profession[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadProfessions = useCallback(
    async () => {
      setError(null);

      try {
        const response =
          await getProfessions();

        setProfessions(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Professions could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadProfessions();
  }, [loadProfessions]);

  return {
    professions,
    isLoading,
    error
  };
}