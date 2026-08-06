import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createCharacter as createCharacterRequest,
  deleteCharacter as deleteCharacterRequest,
  getCharacters,
  updateCharacter as updateCharacterRequest
} from "../api/characterApi";
import type {
  Character,
  CharacterInput
} from "../types/character.types";

type CharacterActions = {
  characters: Character[];
  isLoading: boolean;
  error: string | null;
  createCharacter: (
    input: CharacterInput
  ) => Promise<void>;
  updateCharacter: (
    characterId: string,
    input: CharacterInput
  ) => Promise<void>;
  deleteCharacter: (
    characterId: string
  ) => Promise<void>;
};

export function useCharacters(): CharacterActions {
  const [characters, setCharacters] =
    useState<Character[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const loadCharacters = useCallback(
    async () => {
      setError(null);

      try {
        const response = await getCharacters();
        setCharacters(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Charaktere konnten nicht geladen werden."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadCharacters();
  }, [loadCharacters]);

  const createCharacter = async (
    input: CharacterInput
  ) => {
    setError(null);

    try {
      await createCharacterRequest(input);
      await loadCharacters();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Charakter konnte nicht erstellt werden.";

      setError(message);
      throw createError;
    }
  };

  const updateCharacter = async (
    characterId: string,
    input: CharacterInput
  ) => {
    setError(null);

    try {
      await updateCharacterRequest(
        characterId,
        input
      );

      await loadCharacters();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Charakter konnte nicht aktualisiert werden.";

      setError(message);
      throw updateError;
    }
  };

  const deleteCharacter = async (
    characterId: string
  ) => {
    setError(null);

    try {
      await deleteCharacterRequest(characterId);
      await loadCharacters();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Charakter konnte nicht gelöscht werden.";

      setError(message);
      throw deleteError;
    }
  };

  return {
    characters,
    isLoading,
    error,
    createCharacter,
    updateCharacter,
    deleteCharacter
  };
}