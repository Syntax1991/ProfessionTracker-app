import type {
  ProfessionDetail
} from "../types/professionDetail.types";

export type ProfessionCapabilityCharacter = {
  id: string;
  name: string;
  realm: string;
  className: string;
  recipeCount: number;
  primaryRecipeCount: number;
};

export type ProfessionCapabilityGroup = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  expansion: string;
  slotKey: string | null;
  characters:
    ProfessionCapabilityCharacter[];
};

export function createProfessionCapabilityGroups(
  detail: ProfessionDetail
): ProfessionCapabilityGroup[] {
  const groups =
    new Map<
      string,
      ProfessionCapabilityGroup
    >();

  for (
    const coverage of
    detail.characters
  ) {
    for (
      const capability of
      coverage.capabilities
    ) {
      const character:
        ProfessionCapabilityCharacter = {
          id:
            coverage.character.id,

          name:
            coverage.character.name,

          realm:
            coverage.character.realm,

          className:
            coverage.character.className,

          recipeCount:
            capability.recipeCount,

          primaryRecipeCount:
            capability
              .primaryRecipeCount
        };

      const existing =
        groups.get(
          capability.id
        );

      if (existing) {
        existing.characters.push(
          character
        );

        continue;
      }

      groups.set(
        capability.id,
        {
          id:
            capability.id,

          name:
            capability.name,

          type:
            capability.type,

          description:
            capability.description,

          expansion:
            capability.expansion,

          slotKey:
            capability.slotKey,

          characters: [
            character
          ]
        }
      );
    }
  }

  return [
    ...groups.values()
  ]
    .map(
      sortGroupCharacters
    )
    .sort(
      compareGroups
    );
}

function sortGroupCharacters(
  group:
    ProfessionCapabilityGroup
): ProfessionCapabilityGroup {
  group.characters.sort(
    (
      left,
      right
    ) =>
      right.recipeCount -
        left.recipeCount ||
      left.name.localeCompare(
        right.name,
        "de"
      ) ||
      left.realm.localeCompare(
        right.realm,
        "de"
      )
  );

  return group;
}

function compareGroups(
  left:
    ProfessionCapabilityGroup,
  right:
    ProfessionCapabilityGroup
): number {
  return (
    left.type.localeCompare(
      right.type,
      "de"
    ) ||
    left.expansion.localeCompare(
      right.expansion,
      "de"
    ) ||
    left.name.localeCompare(
      right.name,
      "de"
    )
  );
}