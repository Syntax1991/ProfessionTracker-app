import type { RequestHandler } from "express";
import { WeeklyChecklistService } from "./weekly-checklist.service.js";
import {
  weeklyChecklistCharacterIdSchema,
  weeklyChecklistTaskKeySchema,
  weeklyTaskUpdateSchema
} from "./weekly-checklist.validation.js";

export class WeeklyChecklistController {
  constructor(
    private readonly service:
      WeeklyChecklistService
  ) {}

  getChecklist: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.getChecklist()
    );
  };

  updateTask: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      weeklyChecklistCharacterIdSchema.parse(
        request.params.characterId
      );
    const taskKey =
      weeklyChecklistTaskKeySchema.parse(
        request.params.taskKey
      );
    const input =
      weeklyTaskUpdateSchema.parse(
        request.body
      );

    response.json(
      await this.service.updateTask(
        characterId,
        taskKey,
        input
      )
    );
  };

  updateAllTasks: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      weeklyChecklistCharacterIdSchema.parse(
        request.params.characterId
      );
    const input =
      weeklyTaskUpdateSchema.parse(
        request.body
      );

    response.json(
      await this.service.updateAllTasks(
        characterId,
        input
      )
    );
  };
}
