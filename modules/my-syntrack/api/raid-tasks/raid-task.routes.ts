import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { RaidTaskController } from "./raid-task.controller.js";
import { RaidTaskRepository } from "./raid-task.repository.js";
import { RaidTaskService } from "./raid-task.service.js";

const repository =
  new RaidTaskRepository();
const service =
  new RaidTaskService(repository);
const controller =
  new RaidTaskController(service);

export const raidTaskRouter = Router();

raidTaskRouter.get(
  "/",
  asyncHandler(controller.getOverview)
);

raidTaskRouter.post(
  "/characters/:characterId",
  asyncHandler(controller.createTask)
);

raidTaskRouter.patch(
  "/:taskId/completion",
  asyncHandler(controller.updateCompletion)
);

raidTaskRouter.delete(
  "/:taskId",
  asyncHandler(controller.deleteTask)
);
