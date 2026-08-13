import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { WeeklyChecklistController } from "./weekly-checklist.controller.js";
import { WeeklyChecklistRepository } from "./weekly-checklist.repository.js";
import { WeeklyChecklistService } from "./weekly-checklist.service.js";

const repository =
  new WeeklyChecklistRepository();
const service =
  new WeeklyChecklistService(repository);
const controller =
  new WeeklyChecklistController(service);

export const weeklyChecklistRouter =
  Router();

weeklyChecklistRouter.get(
  "/",
  asyncHandler(controller.getChecklist)
);

weeklyChecklistRouter.put(
  "/:characterId/tasks/:taskKey",
  asyncHandler(controller.updateTask)
);

weeklyChecklistRouter.put(
  "/:characterId",
  asyncHandler(controller.updateAllTasks)
);
