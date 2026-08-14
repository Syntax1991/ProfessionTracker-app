import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class RaidSignupRepository {
  findEventById(eventId: string) {
    return prisma.raidEvent.findUnique({
      where: {
        id: eventId
      }
    });
  }

  findSignupsForEvent(
    eventId: string
  ) {
    return prisma.raidSignup.findMany({
      where: {
        raidEventId: eventId
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

  upsertSignup(
    eventId: string,
    memberId: string,
    status: string
  ) {
    return prisma.raidSignup.upsert({
      where: {
        raidEventId_memberId: {
          raidEventId: eventId,
          memberId
        }
      },
      create: {
        raidEventId: eventId,
        memberId,
        status
      },
      update: {
        status
      }
    });
  }

  deleteSignup(
    eventId: string,
    memberId: string
  ) {
    return prisma.raidSignup.deleteMany({
      where: {
        raidEventId: eventId,
        memberId
      }
    });
  }
}
