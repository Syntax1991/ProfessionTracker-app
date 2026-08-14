import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { RaidCooldownAssignmentInput } from "./cooldown.types.js";

export class RaidCooldownRepository {
  findBossById(bossId: string) {
    return prisma.raidBoss.findUnique({
      where: {
        id: bossId
      }
    });
  }

  findAssignmentById(
    assignmentId: string
  ) {
    return prisma.raidCooldownAssignment.findUnique(
      {
        where: {
          id: assignmentId
        }
      }
    );
  }

  findForEvent(eventId: string) {
    return prisma.raidCooldownAssignment.findMany(
      {
        where: {
          boss: {
            raidEventId: eventId
          }
        },
        orderBy: [
          {
            bossId: "asc"
          },
          {
            sortOrder: "asc"
          }
        ]
      }
    );
  }

  findMemberById(
    memberId: string
  ) {
    return prisma.guildMember.findUnique(
      {
        where: {
          id: memberId
        }
      }
    );
  }

  createAssignment(
    bossId: string,
    input: RaidCooldownAssignmentInput
  ) {
    return prisma.raidCooldownAssignment.create(
      {
        data: {
          bossId,
          memberId: input.memberId,
          abilityName:
            input.abilityName,
          phaseLabel:
            input.phaseLabel,
          sortOrder:
            input.sortOrder
        }
      }
    );
  }

  updateAssignment(
    assignmentId: string,
    input: RaidCooldownAssignmentInput
  ) {
    return prisma.raidCooldownAssignment.update(
      {
        where: {
          id: assignmentId
        },
        data: {
          memberId: input.memberId,
          abilityName:
            input.abilityName,
          phaseLabel:
            input.phaseLabel,
          sortOrder:
            input.sortOrder
        }
      }
    );
  }

  deleteAssignment(
    assignmentId: string
  ) {
    return prisma.raidCooldownAssignment.delete(
      {
        where: {
          id: assignmentId
        }
      }
    );
  }
}
