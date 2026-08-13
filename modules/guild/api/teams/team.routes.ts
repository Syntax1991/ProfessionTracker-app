import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { guildVerificationService } from "../verification/verification.routes.js";
import { GuildTeamController } from "./team.controller.js";
import { GuildTeamRepository } from "./team.repository.js";
import { GuildTeamService } from "./team.service.js";

const repository =
  new GuildTeamRepository();

const service =
  new GuildTeamService(
    repository,
    guildVerificationService
  );

const controller =
  new GuildTeamController(
    service
  );

export const guildTeamRouter =
  Router();

guildTeamRouter.get(
  "/",
  asyncHandler(controller.list)
);

guildTeamRouter.post(
  "/",
  asyncHandler(controller.create)
);

guildTeamRouter.put(
  "/:teamId",
  asyncHandler(controller.update)
);

guildTeamRouter.delete(
  "/:teamId",
  asyncHandler(controller.delete)
);

guildTeamRouter.post(
  "/:teamId/members",
  asyncHandler(
    controller.addMember
  )
);

guildTeamRouter.delete(
  "/:teamId/members/:memberId",
  asyncHandler(
    controller.removeMember
  )
);
