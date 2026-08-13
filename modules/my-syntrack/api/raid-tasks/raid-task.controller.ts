import type { RequestHandler } from "express";
import { RaidTaskService } from "./raid-task.service.js";
import {
  personalRaidTaskInputSchema,
  raidTaskCharacterIdSchema,
  raidTaskCompletionInputSchema,
  raidTaskIdSchema
} from "./raid-task.validation.js";

export class RaidTaskController {
  constructor(
    private readonly service:
      RaidTaskService
  ) {}

  getOverview: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.getOverview()
    );
  };

  createTask: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      raidTaskCharacterIdSchema.parse(
        request.params.characterId
      );
    const input =
      personalRaidTaskInputSchema.parse(
        request.body
      );

    response
      .status(201)
      .json(
        await this.service.createTask(
          characterId,
          input
        )
      );
  };

  updateCompletion: RequestHandler =
    async (
      request,
      response
    ) => {
      const taskId =
        raidTaskIdSchema.parse(
          request.params.taskId
        );
      const input =
        raidTaskCompletionInputSchema.parse(
          request.body
        );

      response.json(
        await this.service.updateCompletion(
          taskId,
          input
        )
      );
    };

  deleteTask: RequestHandler = async (
    request,
    response
  ) => {
    const taskId =
      raidTaskIdSchema.parse(
        request.params.taskId
      );

    response.json(
      await this.service.deleteTask(taskId)
    );
  };
}
