import {
  useEffect,
  useState
} from "react";
import {
  getProfessionCharacters
} from "../api/professionModuleApi";
import type {
  ProfessionCharacterOption
} from "../types/professionModule.types";

type ProfessionCharacterState = {
  characters: ProfessionCharacterOption[];
  isLoading: boolean;
  error: string | null;
};

export function useProfessionCharacters():
  ProfessionCharacterState {
  const [
    characters,
    setCharacters
  ] = useState<ProfessionCharacterOption[]>(
    []
  );

  const [
    isLoading,
    setIsLoading
  ] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(
    () => {
      let cancelled = false;

      async function load() {
        setError(null);
        setIsLoading(true);

        try {
          const response =
            await getProfessionCharacters();

          if (!cancelled) {
            setCharacters(
              response.items.filter(
                (character) =>
                  character.professions.length >
                  0
              )
            );
          }
        }
        catch (loadError) {
          if (!cancelled) {
            setCharacters([]);
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Profession characters could not be loaded."
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
    },
    []
  );

  return {
    characters,
    isLoading,
    error
  };
}
