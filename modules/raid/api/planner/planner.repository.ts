import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { RaidEventInput } from "./planner.types.js";

export class RaidPlannerRepository {
  findAll() {
    return prisma.raidEvent.findMany({
      orderBy: {
        scheduledAt: "asc"
      }
    });
  }

  findById(eventId: string) {
    return prisma.raidEvent.findUnique({
      where: {
        id: eventId
      }
    });
  }

  create(input: RaidEventInput) {
    return prisma.raidEvent.create({
      data: {
        title: input.title,
        raidInstance:
          input.raidInstance,
        difficulty:
          input.difficulty,
        scheduledAt: new Date(
          input.scheduledAt
        ),
        teamId: input.teamId,
        notes: input.notes
      }
    });
  }

  update(
    eventId: string,
    input: RaidEventInput
  ) {
    return prisma.raidEvent.update({
      where: {
        id: eventId
      },
      data: {
        title: input.title,
        raidInstance:
          input.raidInstance,
        difficulty:
          input.difficulty,
        scheduledAt: new Date(
          input.scheduledAt
        ),
        teamId: input.teamId,
        notes: input.notes
      }
    });
  }

  delete(eventId: string) {
    return prisma.raidEvent.delete({
      where: {
        id: eventId
      }
    });
  }
}
