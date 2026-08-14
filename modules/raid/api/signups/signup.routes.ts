import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { guildRaiderLinkService } from "../../../guild/api/raider-link/raider-link.routes.js";
import { GuildRosterRepository } from "../../../guild/api/roster/roster.repository.js";
import { guildVerificationService } from "../../../guild/api/verification/verification.routes.js";
import { RaidSignupController } from "./signup.controller.js";
import { RaidSignupRepository } from "./signup.repository.js";
import { RaidSignupService } from "./signup.service.js";

const repository =
  new RaidSignupRepository();

const rosterRepository =
  new GuildRosterRepository();

const service =
  new RaidSignupService(
    repository,
    rosterRepository,
    guildVerificationService,
    guildRaiderLinkService
  );

const controller =
  new RaidSignupController(
    service
  );

export const raidSignupRouter =
  Router();

raidSignupRouter.get(
  "/events/:eventId",
  asyncHandler(
    controller.listForEvent
  )
);

raidSignupRouter.put(
  "/events/:eventId/members/:memberId",
  asyncHandler(
    controller.setSignup
  )
);

raidSignupRouter.put(
  "/events/:eventId/me",
  asyncHandler(
    controller.setOwnSignup
  )
);

raidSignupRouter.delete(
  "/events/:eventId/members/:memberId",
  asyncHandler(
    controller.clearSignup
  )
);
