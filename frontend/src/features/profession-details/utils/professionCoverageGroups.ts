import type {
  ProfessionCharacterCoverage,
  ProfessionCoverageEntry,
  ProfessionDetail
} from "../types/professionDetail.types";

export type ProfessionCoverageCharacter = {
  id: string;
  name: string;
  realm: string;
  className: string;
  rank: number;
  maxRank: number | null;
  source: string;
};

export type ProfessionCoverageGroup = {
  id: string;
  name: string;
  path: string;
  characters:
    ProfessionCoverageCharacter[];
};

export type ProfessionCoverageGroups = {
  specializations:
    ProfessionCoverageGroup[];
  slots:
    ProfessionCoverageGroup[];
};

type CoverageProperty =
  | "specializations"
  | "slots";

export function createProfessionCoverageGroups(
  detail: ProfessionDetail
): ProfessionCoverageGroups {
  return {
    specializations:
      createCoverageGroups(
        detail.characters,
        "specializations"
      ),

    slots:
      createCoverageGroups(
        detail.characters,
        "slots"
      )
  };
}

function createCoverageGroups(
  characters:
    ProfessionCharacterCoverage[],
  property: CoverageProperty
): ProfessionCoverageGroup[] {
  const groups =
    new Map<
      string,
      ProfessionCoverageGroup
    >();

  for (
    const coverage of
    characters
  ) {
    for (
      const entry of
      coverage[property]
    ) {
      addCoverageEntry(
        groups,
        coverage,
        entry
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

function addCoverageEntry(
  groups:
    Map<
      string,
      ProfessionCoverageGroup
    >,
  coverage:
    ProfessionCharacterCoverage,
  entry:
    ProfessionCoverageEntry
): void {
  const existingGroup =
    groups.get(
      entry.id
    );

  const character =
    createCoverageCharacter(
      coverage,
      entry
    );

  if (existingGroup) {
    existingGroup.characters.push(
      character
    );

    return;
  }

  groups.set(
    entry.id,
    {
      id:
        entry.id,

      name:
        entry.name,

      path:
        entry.path,

      characters: [
        character
      ]
    }
  );
}

function createCoverageCharacter(
  coverage:
    ProfessionCharacterCoverage,
  entry:
    ProfessionCoverageEntry
): ProfessionCoverageCharacter {
  return {
    id:
      coverage.character.id,

    name:
      coverage.character.name,

    realm:
      coverage.character.realm,

    className:
      coverage.character.className,

    rank:
      entry.rank,

    maxRank:
      entry.maxRank,

    source:
      entry.source
  };
}

function sortGroupCharacters(
  group:
    ProfessionCoverageGroup
): ProfessionCoverageGroup {
  return {
    ...group,

    characters:
      [...group.characters].sort(
        (left, right) =>
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
  left: ProfessionCoverageGroup,
  right: ProfessionCoverageGroup
): number {
  return left.path.localeCompare(
    right.path,
    "de"
  );
}