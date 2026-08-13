import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { PersonalRaidTaskInput } from "./raid-task.types.js";

export class RaidTaskRepository {
  findCharacterById(characterId: string) {
    return prisma.character.findUnique({
      where: {
        id: characterId
      },
      select: {
        id: true
      }
    });
  }

  findCharacters() {
    return prisma.character.findMany({
      select: {
        id: true,
        name: true,
        realm: true,
        region: true,
        className: true,
        level: true,
        personalRaidTasks: {
          orderBy: {
            createdAt: "desc"
          }
        }
      },
      orderBy: [
        {
          level: "desc"
        },
        {
          name: "asc"
        }
      ]
    });
  }

  createTask(
    characterId: string,
    input: PersonalRaidTaskInput
  ) {
    return prisma.personalRaidTask.create({
      data: {
        characterId,
        title: input.title.trim(),
        description:
          input.description?.trim() ||
          null,
        category: input.category,
        priority: input.priority,
        raidName:
          input.raidName?.trim() || null,
        dueAt: input.dueAt
          ? new Date(input.dueAt)
          : null
      }
    });
  }

  findTaskById(taskId: string) {
    return prisma.personalRaidTask.findUnique({
      where: {
        id: taskId
      }
    });
  }

  setTaskCompletion(
    taskId: string,
    completed: boolean
  ) {
    return prisma.personalRaidTask.update({
      where: {
        id: taskId
      },
      data: {
        completedAt: completed
          ? new Date()
          : null
      }
    });
  }

  deleteTask(taskId: string) {
    return prisma.personalRaidTask.delete({
      where: {
        id: taskId
      }
    });
  }
}
