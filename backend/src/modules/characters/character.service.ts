import { AppError } from "../../shared/errors/AppError.js";
import { ProfessionRepository } from "../professions/profession.repository.js";
import { CharacterRepository } from "./character.repository.js";
import type { CharacterInput } from "./character.types.js";

export class CharacterService {
  constructor(
    private readonly characterRepository:
      CharacterRepository,

    private readonly professionRepository:
      ProfessionRepository
  ) {}

  list() {
    return this
      .characterRepository
      .findAll();
  }

  async create(
    input: CharacterInput
  ) {
    const normalizedInput =
      this.normalize(input);

    await this.validateProfessionIds(
      normalizedInput.professionIds
    );

    const existingCharacter =
      await this
        .characterRepository
        .findByIdentity(
          normalizedInput.name,
          normalizedInput.realm,
          normalizedInput.region
        );

    if (existingCharacter) {
      throw new AppError(
        409,
        "Ein Charakter mit diesem Namen, Realm und dieser Region existiert bereits."
      );
    }

    return this
      .characterRepository
      .create(normalizedInput);
  }

  async update(
    characterId: string,
    input: CharacterInput
  ) {
    const currentCharacter =
      await this
        .characterRepository
        .findById(characterId);

    if (!currentCharacter) {
      throw new AppError(
        404,
        "Charakter nicht gefunden."
      );
    }

    const normalizedInput =
      this.normalize(input);

    await this.validateProfessionIds(
      normalizedInput.professionIds
    );

    const duplicate =
      await this
        .characterRepository
        .findByIdentity(
          normalizedInput.name,
          normalizedInput.realm,
          normalizedInput.region
        );

    if (
      duplicate &&
      duplicate.id !== characterId
    ) {
      throw new AppError(
        409,
        "Ein anderer Charakter verwendet bereits diese Identität."
      );
    }

    return this
      .characterRepository
      .update(
        characterId,
        normalizedInput
      );
  }

  async delete(
    characterId: string
  ) {
    const character =
      await this
        .characterRepository
        .findById(characterId);

    if (!character) {
      throw new AppError(
        404,
        "Charakter nicht gefunden."
      );
    }

    await this
      .characterRepository
      .delete(characterId);
  }

  private normalize(
    input: CharacterInput
  ): CharacterInput {
    return {
      ...input,
      name: input.name.trim(),
      realm: input.realm.trim(),
      region:
        input.region.toLowerCase(),
      className:
        input.className.trim(),
      professionIds: [
        ...new Set(
          input.professionIds
        )
      ]
    };
  }

  private async validateProfessionIds(
    professionIds: string[]
  ) {
    if (professionIds.length > 2) {
      throw new AppError(
        400,
        "Ein Charakter kann maximal zwei Primärberufe besitzen."
      );
    }

    const professionCount =
      await this
        .professionRepository
        .countByIds(
          professionIds
        );

    if (
      professionCount !==
      professionIds.length
    ) {
      throw new AppError(
        400,
        "Mindestens eine Berufs-ID ist ungültig."
      );
    }
  }
}