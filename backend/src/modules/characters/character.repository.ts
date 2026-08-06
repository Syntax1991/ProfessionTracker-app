import { prisma } from "../../infrastructure/database/prismaClient.js";
import type { CharacterInput } from "./character.types.js";

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

  findById(
    characterId: string
  ) {
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

  create(
    input: CharacterInput
  ) {
    return prisma.character.create({
      data: {
        name: input.name,
        realm: input.realm,
        region: input.region,
        className: input.className,
        level: input.level,
        professions: {
          create:
            input.professionIds.map(
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
          create:
            input.professionIds.map(
              (professionId) => ({
                professionId
              })
            )
        }
      },
      include: characterInclude
    });
  }

  delete(
    characterId: string
  ) {
    return prisma.character.delete({
      where: {
        id: characterId
      }
    });
  }
}