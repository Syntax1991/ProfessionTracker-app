import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { GuildRosterController } from "./roster.controller.js";
import { GuildRosterRepository } from "./roster.repository.js";
import { GuildRosterService } from "./roster.service.js";

const repository =
  new GuildRosterRepository();

const service =
  new GuildRosterService(
    repository
  );

const controller =
  new GuildRosterController(
    service
  );

export const guildRosterRouter =
  Router();

guildRosterRouter.get(
  "/",
  asyncHandler(controller.list)
);

guildRosterRouter.post(
  "/",
  asyncHandler(controller.create)
);

guildRosterRouter.put(
  "/:memberId",
  asyncHandler(controller.update)
);

guildRosterRouter.delete(
  "/:memberId",
  asyncHandler(controller.delete)
);
