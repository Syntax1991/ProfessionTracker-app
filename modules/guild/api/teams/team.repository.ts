import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type {
  GuildTeamInput,
  GuildTeamMemberInput
} from "./team.types.js";

const teamInclude = {
  members: {
    include: {
      member: true
    },
    orderBy: {
      joinedAt: "asc" as const
    }
  }
} as const;

export class GuildTeamRepository {
  findAll() {
    return prisma.guildTeam.findMany({
      include: teamInclude,
      orderBy: [
        {
          sortOrder: "asc"
        },
        {
          name: "asc"
        }
      ]
    });
  }

  findById(teamId: string) {
    return prisma.guildTeam.findUnique({
      where: {
        id: teamId
      },
      include: teamInclude
    });
  }

  findByName(name: string) {
    return prisma.guildTeam.findUnique({
      where: {
        name
      }
    });
  }

  findMemberById(
    memberId: string
  ) {
    return prisma.guildMember.findUnique({
      where: {
        id: memberId
      }
    });
  }

  create(input: GuildTeamInput) {
    return prisma.guildTeam.create({
      data: {
        name: input.name,
        description:
          input.description,
        color: input.color,
        sortOrder:
          input.sortOrder
      },
      include: teamInclude
    });
  }

  update(
    teamId: string,
    input: GuildTeamInput
  ) {
    return prisma.guildTeam.update({
      where: {
        id: teamId
      },
      data: {
        name: input.name,
        description:
          input.description,
        color: input.color,
        sortOrder:
          input.sortOrder
      },
      include: teamInclude
    });
  }

  delete(teamId: string) {
    return prisma.guildTeam.delete({
      where: {
        id: teamId
      }
    });
  }

  addMember(
    teamId: string,
    input: GuildTeamMemberInput
  ) {
    return prisma.guildTeamMembership.upsert({
      where: {
        teamId_memberId: {
          teamId,
          memberId:
            input.memberId
        }
      },
      create: {
        teamId,
        memberId:
          input.memberId,
        role: input.role
      },
      update: {
        role: input.role
      }
    });
  }

  removeMember(
    teamId: string,
    memberId: string
  ) {
    return prisma.guildTeamMembership.deleteMany({
      where: {
        teamId,
        memberId
      }
    });
  }
}
