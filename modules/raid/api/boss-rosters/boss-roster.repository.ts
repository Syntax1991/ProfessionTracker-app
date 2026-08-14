import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { RaidBossInput } from "./boss-roster.types.js";

export class RaidBossRosterRepository {
  findEventById(eventId: string) {
    return prisma.raidEvent.findUnique({
      where: {
        id: eventId
      }
    });
  }

  findBossesForEvent(
    eventId: string
  ) {
    return prisma.raidBoss.findMany({
      where: {
        raidEventId: eventId
      },
      include: {
        rosterEntries: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    });
  }

  findBossById(bossId: string) {
    return prisma.raidBoss.findUnique({
      where: {
        id: bossId
      },
      include: {
        rosterEntries: true
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

  createBoss(
    eventId: string,
    input: RaidBossInput
  ) {
    return prisma.raidBoss.create({
      data: {
        raidEventId: eventId,
        name: input.name,
        sortOrder:
          input.sortOrder
      },
      include: {
        rosterEntries: true
      }
    });
  }

  updateBoss(
    bossId: string,
    input: RaidBossInput
  ) {
    return prisma.raidBoss.update({
      where: {
        id: bossId
      },
      data: {
        name: input.name,
        sortOrder:
          input.sortOrder
      },
      include: {
        rosterEntries: true
      }
    });
  }

  deleteBoss(bossId: string) {
    return prisma.raidBoss.delete({
      where: {
        id: bossId
      }
    });
  }

  upsertEntry(
    bossId: string,
    memberId: string,
    status: string
  ) {
    return prisma.raidBossRosterEntry.upsert({
      where: {
        bossId_memberId: {
          bossId,
          memberId
        }
      },
      create: {
        bossId,
        memberId,
        status
      },
      update: {
        status
      }
    });
  }

  deleteEntry(
    bossId: string,
    memberId: string
  ) {
    return prisma.raidBossRosterEntry.deleteMany({
      where: {
        bossId,
        memberId
      }
    });
  }
}
