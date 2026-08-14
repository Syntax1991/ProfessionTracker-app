import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { GuildMemberInput } from "./roster.types.js";

export class GuildRosterRepository {
  findAll() {
    return prisma.guildMember.findMany({
      orderBy: [
        {
          rankIndex: "asc"
        },
        {
          name: "asc"
        }
      ]
    });
  }

  findById(memberId: string) {
    return prisma.guildMember.findUnique({
      where: {
        id: memberId
      }
    });
  }

  findByIdentity(
    name: string,
    realm: string,
    region: string
  ) {
    return prisma.guildMember.findUnique({
      where: {
        name_realm_region: {
          name,
          realm,
          region
        }
      }
    });
  }

  create(input: GuildMemberInput) {
    return prisma.guildMember.create({
      data: {
        name: input.name,
        realm: input.realm,
        region: input.region,
        className: input.className,
        level: input.level,
        rank: input.rank,
        rankIndex: input.rankIndex,
        role: input.role,
        note: input.note,
        officerNote: input.officerNote
      }
    });
  }

  update(
    memberId: string,
    input: GuildMemberInput
  ) {
    return prisma.guildMember.update({
      where: {
        id: memberId
      },
      data: {
        name: input.name,
        realm: input.realm,
        region: input.region,
        className: input.className,
        level: input.level,
        rank: input.rank,
        rankIndex: input.rankIndex,
        role: input.role,
        note: input.note,
        officerNote: input.officerNote
      }
    });
  }

  delete(memberId: string) {
    return prisma.guildMember.delete({
      where: {
        id: memberId
      }
    });
  }
}
