import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { raiderAuthService } from "../../../data-platform/api/raider-auth/raider-auth.routes.js";
import { GuildRosterRepository } from "../roster/roster.repository.js";
import { GuildRaiderLinkController } from "./raider-link.controller.js";
import { RaiderLinkRepository } from "./raider-link.repository.js";
import { GuildRaiderLinkService } from "./raider-link.service.js";

const repository =
  new RaiderLinkRepository();

const rosterRepository =
  new GuildRosterRepository();

export const guildRaiderLinkService =
  new GuildRaiderLinkService(
    repository,
    rosterRepository,
    raiderAuthService
  );

const controller =
  new GuildRaiderLinkController(
    guildRaiderLinkService
  );

export const guildRaiderLinkRouter =
  Router();

guildRaiderLinkRouter.post(
  "/resolve",
  asyncHandler(
    controller.resolve
  )
);

guildRaiderLinkRouter.post(
  "/claim",
  asyncHandler(
    controller.claim
  )
);

guildRaiderLinkRouter.get(
  "/me",
  asyncHandler(
    controller.getLinkedMember
  )
);
