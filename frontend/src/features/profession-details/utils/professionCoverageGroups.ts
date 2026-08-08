import type {
  ProfessionCharacterCoverage,
  ProfessionDetail
} from "../types/professionDetail.types";

export type ProfessionCoverageCharacter = {
  id: string;
  name: string;
  realm: string;
  className: string;
  skillPoints: number;
  maxSkillPoints: number | null;
  unlocked: boolean;
  source: string;
};

export type ProfessionCoverageGroup = {
  id: string;
  name: string;
  characters:
    ProfessionCoverageCharacter[];
};

const slotOrder =
  new Map(
    [
      "Head",
      "Neck",
      "Shoulder",
      "Back",
      "Chest",
      "Wrist",
      "Hands",
      "Waist",
      "Legs",
      "Feet",
      "Finger",
      "Trinket",
      "Main Hand",
      "Off Hand",
      "Two-Hand"
    ].map(
      (
        name,
        index
      ) =>
        [
          name,
          index
        ] as const
    )
  );

export function createProfessionCoverageGroups(
  detail: ProfessionDetail
): ProfessionCoverageGroup[] {
  const groups =
    new Map<
      string,
      ProfessionCoverageGroup
    >();

  for (
    const coverage of
    detail.characters
  ) {
    addCharacterSlots(
      groups,
      coverage
    );
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

function addCharacterSlots(
  groups:
    Map<
      string,
      ProfessionCoverageGroup
    >,
  coverage:
    ProfessionCharacterCoverage
): void {
  for (
    const slot of
    coverage.slots
  ) {
    const character:
      ProfessionCoverageCharacter = {
        id:
          coverage.character.id,

        name:
          coverage.character.name,

        realm:
          coverage.character.realm,

        className:
          coverage.character.className,

        skillPoints:
          slot.skillPoints,

        maxSkillPoints:
          slot.maxSkillPoints,

        unlocked:
          slot.unlocked,

        source:
          slot.source
      };

    const existingGroup =
      groups.get(
        slot.id
      );

    if (existingGroup) {
      if (
        !existingGroup.characters.some(
          (existingCharacter) =>
            existingCharacter.id ===
            character.id
        )
      ) {
        existingGroup.characters.push(
          character
        );
      }

      continue;
    }

    groups.set(
      slot.id,
      {
        id:
          slot.id,

        name:
          slot.name,

        characters: [
          character
        ]
      }
    );
  }
}

function sortGroupCharacters(
  group:
    ProfessionCoverageGroup
): ProfessionCoverageGroup {
  return {
    ...group,

    characters:
      [...group.characters].sort(
        (
          left,
          right
        ) =>
          left.name.localeCompare(
            right.name,
            "de"
          ) ||
          left.realm.localeCompare(
            right.realm,
            "de"
          )
      )
  };
}

function compareGroups(
  left:
    ProfessionCoverageGroup,
  right:
    ProfessionCoverageGroup
): number {
  const leftOrder =
    slotOrder.get(
      left.name
    ) ??
    Number.MAX_SAFE_INTEGER;

  const rightOrder =
    slotOrder.get(
      right.name
    ) ??
    Number.MAX_SAFE_INTEGER;

  return (
    leftOrder -
      rightOrder ||
    left.name.localeCompare(
      right.name,
      "en"
    )
  );
}