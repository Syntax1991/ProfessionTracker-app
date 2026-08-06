import type { BattleNetProfessionAssignmentInput } from "../../characters/character.types.js";
import { getProfessionKeyByBattleNetId } from "./battlenet.profession-map.js";
import type {
  BattleNetAccountProfile,
  BattleNetProfessionEntry,
  BattleNetProfessionsResponse
} from "./battlenet.types.js";

export type ImportableBattleNetCharacter = {
  battleNetId: string;
  name: string;
  realm: string;
  realmSlug: string;
  className: string;
  level: number;
};

type BattleNetCharacterIdentity = {
  battleNetId: string;
  realmSlug: string;
};

export function createBattleNetCharacterKey(
  character: BattleNetCharacterIdentity
): string {
  return [
    character.battleNetId,
    character.realmSlug.toLowerCase()
  ].join(":");
}

export function normalizeBattleNetCharacters(
  profile: BattleNetAccountProfile
): ImportableBattleNetCharacter[] {
  const characterMap =
    new Map<
      string,
      ImportableBattleNetCharacter
    >();

  for (
    const account of
    profile.wow_accounts ?? []
  ) {
    for (
      const character of
      account.characters ?? []
    ) {
      if (
        typeof character.id !== "number" ||
        typeof character.name !== "string" ||
        typeof character.level !== "number" ||
        typeof character.realm?.name !== "string" ||
        typeof character.realm?.slug !== "string" ||
        typeof character.playable_class?.name !==
          "string"
      ) {
        continue;
      }

      const normalizedCharacter = {
        battleNetId: String(character.id),
        name: character.name,
        realm: character.realm.name,
        realmSlug: character.realm.slug,
        className:
          character.playable_class.name,
        level: character.level
      };

      characterMap.set(
        createBattleNetCharacterKey(
          normalizedCharacter
        ),
        normalizedCharacter
      );
    }
  }

  return [...characterMap.values()];
}

export function createBattleNetProfessionAssignments(
  data: BattleNetProfessionsResponse,
  professionIdByKey: Map<string, string>
): BattleNetProfessionAssignmentInput[] {
  return (data.primaries ?? [])
    .map((entry) =>
      createProfessionAssignment(
        entry,
        professionIdByKey
      )
    )
    .filter(
      (
        assignment
      ): assignment is BattleNetProfessionAssignmentInput =>
        assignment !== null
    )
    .slice(0, 2);
}

function createProfessionAssignment(
  entry: BattleNetProfessionEntry,
  professionIdByKey: Map<string, string>
): BattleNetProfessionAssignmentInput | null {
  const battleNetProfessionId =
    entry.profession?.id;

  if (
    typeof battleNetProfessionId !==
    "number"
  ) {
    return null;
  }

  const professionKey =
    getProfessionKeyByBattleNetId(
      battleNetProfessionId
    );

  if (!professionKey) {
    return null;
  }

  const professionId =
    professionIdByKey.get(
      professionKey
    );

  if (!professionId) {
    return null;
  }

  const primaryTier =
    entry.tiers?.[0];

  const skill =
    primaryTier?.skill_points ?? 0;

  const maximumSkill =
    primaryTier?.max_skill_points ?? 0;

  const tierName =
    primaryTier?.tier?.name;

  return {
    professionId,
    skill,
    knowledgePoints: 0,
    specializationSummary:
      tierName
        ? `${tierName}: ${skill}/${maximumSkill}`
        : null
  };
}