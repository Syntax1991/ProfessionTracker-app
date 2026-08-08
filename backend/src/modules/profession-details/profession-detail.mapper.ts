import {
  mapProfessionCharacterCoverage
} from "./profession-coverage.mapper.js";
import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCharacterCoverage,
  ProfessionDetailView
} from "./profession-detail.types.js";

type DetailRecord =
  NonNullable<
    Awaited<
      ReturnType<
        ProfessionDetailRepository["findById"]
      >
    >
  >;

export function mapProfessionDetail(
  profession: DetailRecord
): ProfessionDetailView {
  const hasCatalog =
    profession
      .specializationTrees
      .length > 0;

  const characters =
    profession.assignments
      .map(
        (assignment) =>
          mapProfessionCharacterCoverage(
            assignment,
            hasCatalog
          )
      )
      .sort(
        compareCharacterCoverage
      );

  const trackedCharacterCount =
    characters.filter(
      (character) =>
        character.dataStatus ===
        "TRACKED"
    ).length;

  return {
    profession: {
      id:
        profession.id,

      key:
        profession.key,

      name:
        profession.name,

      category:
        profession.category
    },

    summary: {
      characterCount:
        characters.length,

      trackedCharacterCount,

      missingCharacterCount:
        characters.length -
        trackedCharacterCount,

      slotCount:
        sumSlotCoverage(
          characters
        )
    },

    characters
  };
}

function sumSlotCoverage(
  characters:
    ProfessionCharacterCoverage[]
): number {
  return characters.reduce(
    (
      total,
      character
    ) =>
      total +
      character.slots.length,
    0
  );
}

function compareCharacterCoverage(
  left:
    ProfessionCharacterCoverage,
  right:
    ProfessionCharacterCoverage
): number {
  return (
    left.character.name.localeCompare(
      right.character.name,
      "de"
    ) ||
    left.character.realm.localeCompare(
      right.character.realm,
      "de"
    )
  );
}