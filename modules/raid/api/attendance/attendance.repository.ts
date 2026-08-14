import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class RaidAttendanceRepository {
  findEventById(eventId: string) {
    return prisma.raidEvent.findUnique({
      where: {
        id: eventId
      }
    });
  }

  findAllEventsWithRecords() {
    return prisma.raidEvent.findMany({
      include: {
        attendanceRecords: true
      },
      orderBy: {
        scheduledAt: "asc"
      }
    });
  }

  findRecordsForEvent(
    eventId: string
  ) {
    return prisma.raidAttendanceRecord.findMany({
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

  upsertRecord(
    eventId: string,
    memberId: string,
    status: string
  ) {
    return prisma.raidAttendanceRecord.upsert({
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

  deleteRecord(
    eventId: string,
    memberId: string
  ) {
    return prisma.raidAttendanceRecord.deleteMany({
      where: {
        raidEventId: eventId,
        memberId
      }
    });
  }
}
