import { apiRequest } from "../../../shared/api/httpClient";
import type {
  Character,
  CharacterInput,
  CharacterListResponse
} from "../types/character.types";

export function getCharacters():
  Promise<CharacterListResponse> {
  return apiRequest<CharacterListResponse>(
    "/characters"
  );
}

export function createCharacter(
  input: CharacterInput
): Promise<Character> {
  return apiRequest<Character>(
    "/characters",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function updateCharacter(
  characterId: string,
  input: CharacterInput
): Promise<Character> {
  return apiRequest<Character>(
    `/characters/${characterId}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function deleteCharacter(
  characterId: string
): Promise<void> {
  return apiRequest<void>(
    `/characters/${characterId}`,
    {
      method: "DELETE"
    }
  );
}