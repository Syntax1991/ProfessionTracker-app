import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { GuildRequirementInput } from "./requirement.types.js";

export class GuildRequirementRepository {
  findAll() {
    return prisma.guildRequirement.findMany({
      orderBy: [
        {
          sortOrder: "asc"
        },
        {
          title: "asc"
        }
      ]
    });
  }

  findById(
    requirementId: string
  ) {
    return prisma.guildRequirement.findUnique({
      where: {
        id: requirementId
      }
    });
  }

  create(
    input: GuildRequirementInput
  ) {
    return prisma.guildRequirement.create({
      data: {
        title: input.title,
        description:
          input.description,
        category:
          input.category,
        sortOrder:
          input.sortOrder
      }
    });
  }

  update(
    requirementId: string,
    input: GuildRequirementInput
  ) {
    return prisma.guildRequirement.update({
      where: {
        id: requirementId
      },
      data: {
        title: input.title,
        description:
          input.description,
        category:
          input.category,
        sortOrder:
          input.sortOrder
      }
    });
  }

  delete(
    requirementId: string
  ) {
    return prisma.guildRequirement.delete({
      where: {
        id: requirementId
      }
    });
  }
}
