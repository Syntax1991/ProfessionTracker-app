import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class GuildWeeklyProgressRepository {
  findAllMembers() {
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

  findCharactersForPeriod(
    periodKey: string
  ) {
    return prisma.character.findMany({
      select: {
        name: true,
        realm: true,
        region: true,
        weeklyCompletions: {
          where: {
            periodKey
          },
          select: {
            id: true
          }
        },
        weeklyMythicRuns: {
          where: {
            periodKey
          },
          select: {
            keyLevel: true
          }
        }
      }
    });
  }

  countEnabledTasks() {
    return prisma.weeklyChecklistTask.count(
      {
        where: {
          enabled: true
        }
      }
    );
  }
}
