import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import { raiderAuthService } from "../../../data-platform/api/raider-auth/raider-auth.routes.js";
import { guildRaiderLinkService } from "../raider-link/raider-link.routes.js";
import { GuildVerificationController } from "./verification.controller.js";
import { GuildVerificationRepository } from "./verification.repository.js";
import { GuildVerificationService } from "./verification.service.js";

const repository =
  new GuildVerificationRepository();

const battleNetClient =
  new BattleNetClient();

export const guildVerificationService =
  new GuildVerificationService(
    repository,
    raiderAuthService,
    battleNetClient,
    guildRaiderLinkService
  );

const controller =
  new GuildVerificationController(
    guildVerificationService
  );

export const guildVerificationRouter =
  Router();

guildVerificationRouter.get(
  "/candidates",
  asyncHandler(
    controller.listCandidates
  )
);

guildVerificationRouter.post(
  "/lookup",
  asyncHandler(
    controller.lookupGuild
  )
);

guildVerificationRouter.get(
  "/status",
  asyncHandler(
    controller.getStatus
  )
);

guildVerificationRouter.post(
  "/verify",
  asyncHandler(controller.verify)
);

guildVerificationRouter.post(
  "/clear",
  asyncHandler(controller.clear)
);
