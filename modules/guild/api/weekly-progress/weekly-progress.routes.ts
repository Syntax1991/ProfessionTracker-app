import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { GuildWeeklyProgressController } from "./weekly-progress.controller.js";
import { GuildWeeklyProgressRepository } from "./weekly-progress.repository.js";
import { GuildWeeklyProgressService } from "./weekly-progress.service.js";

const repository =
  new GuildWeeklyProgressRepository();

const service =
  new GuildWeeklyProgressService(
    repository
  );

const controller =
  new GuildWeeklyProgressController(
    service
  );

export const guildWeeklyProgressRouter =
  Router();

guildWeeklyProgressRouter.get(
  "/",
  asyncHandler(
    controller.getSummary
  )
);
