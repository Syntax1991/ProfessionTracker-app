import { prisma } from "../../infrastructure/database/prismaClient.js";
import type {
  BattleNetCharacterInput,
  CharacterInput
} from "./character.types.js";

const characterInclude = {
  professions: {
    include: {
      profession: true
    }
  }
} as const;

export class CharacterRepository {
  findAll() {
    return prisma.character.findMany({
      include: characterInclude,
      orderBy: [
        {
          name: "asc"
        },
        {
          realm: "asc"
        }
      ]
    });
  }

  findById(characterId: string) {
    return prisma.character.findUnique({
      where: {
        id: characterId
      },
      include: characterInclude
    });
  }

  findByIdentity(
    name: string,
    realm: string,
    region: string
  ) {
    return prisma.character.findUnique({
      where: {
        name_realm_region: {
          name,
          realm,
          region
        }
      }
    });
  }

  countBySource(source: string) {
    return prisma.character.count({
      where: {
        source
      }
    });
  }

  create(input: CharacterInput) {
    return prisma.character.create({
      data: {
        name: input.name,
        realm: input.realm,
        region: input.region,
        className: input.className,
        level: input.level,
        professions: {
          create: input.professionIds.map(
            (professionId) => ({
              professionId
            })
          )
        }
      },
      include: characterInclude
    });
  }

  update(
    characterId: string,
    input: CharacterInput
  ) {
    return prisma.character.update({
      where: {
        id: characterId
      },
      data: {
        name: input.name,
        realm: input.realm,
        region: input.region,
        className: input.className,
        level: input.level,
        professions: {
          deleteMany: {},
          create: input.professionIds.map(
            (professionId) => ({
              professionId
            })
          )
        }
      },
      include: characterInclude
    });
  }

  async upsertFromBattleNet(
    input: BattleNetCharacterInput
  ) {
    const existingCharacter =
      await prisma.character.findFirst({
        where: {
          OR: [
            {
              battleNetId: input.battleNetId,
              region: input.region
            },
            {
              name: input.name,
              realm: input.realm,
              region: input.region
            }
          ]
        }
      });

    const professionCreates =
      input.professions.map((profession) => ({
        professionId: profession.professionId,
        skill: profession.skill,
        knowledgePoints: profession.knowledgePoints,
        specializationSummary:
          profession.specializationSummary
      }));

    if (existingCharacter) {
      return prisma.character.update({
        where: {
          id: existingCharacter.id
        },
        data: {
          battleNetId: input.battleNetId,
          name: input.name,
          realm: input.realm,
          realmSlug: input.realmSlug,
          region: input.region,
          className: input.className,
          level: input.level,
          source: "BATTLENET",
          lastSyncedAt: new Date(),
          professions: {
            deleteMany: {},
            create: professionCreates
          }
        },
        include: characterInclude
      });
    }

    return prisma.character.create({
      data: {
        battleNetId: input.battleNetId,
        name: input.name,
        realm: input.realm,
        realmSlug: input.realmSlug,
        region: input.region,
        className: input.className,
        level: input.level,
        source: "BATTLENET",
        lastSyncedAt: new Date(),
        professions: {
          create: professionCreates
        }
      },
      include: characterInclude
    });
  }

  delete(characterId: string) {
    return prisma.character.delete({
      where: {
        id: characterId
      }
    });
  }
}