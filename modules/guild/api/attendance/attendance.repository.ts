import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { GuildAttendanceEventInput } from "./attendance.types.js";

const eventInclude = {
  records: {
    include: {
      member: true
    }
  }
} as const;

export class GuildAttendanceRepository {
  findAllEvents() {
    return prisma.guildAttendanceEvent.findMany({
      include: eventInclude,
      orderBy: {
        eventDate: "desc"
      }
    });
  }

  findEventById(
    eventId: string
  ) {
    return prisma.guildAttendanceEvent.findUnique({
      where: {
        id: eventId
      },
      include: eventInclude
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

  createEvent(
    input: GuildAttendanceEventInput
  ) {
    return prisma.guildAttendanceEvent.create({
      data: {
        title: input.title,
        eventDate: new Date(
          input.eventDate
        ),
        raidName:
          input.raidName,
        notes: input.notes
      },
      include: eventInclude
    });
  }

  updateEvent(
    eventId: string,
    input: GuildAttendanceEventInput
  ) {
    return prisma.guildAttendanceEvent.update({
      where: {
        id: eventId
      },
      data: {
        title: input.title,
        eventDate: new Date(
          input.eventDate
        ),
        raidName:
          input.raidName,
        notes: input.notes
      },
      include: eventInclude
    });
  }

  deleteEvent(
    eventId: string
  ) {
    return prisma.guildAttendanceEvent.delete({
      where: {
        id: eventId
      }
    });
  }

  upsertRecord(
    eventId: string,
    memberId: string,
    status: string
  ) {
    return prisma.guildAttendanceRecord.upsert({
      where: {
        eventId_memberId: {
          eventId,
          memberId
        }
      },
      create: {
        eventId,
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
    return prisma.guildAttendanceRecord.deleteMany({
      where: {
        eventId,
        memberId
      }
    });
  }
}
