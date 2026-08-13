import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import { BattleNetRepository } from "../../../data-platform/api/integrations/battlenet/battlenet.repository.js";
import { GuildVerificationController } from "./verification.controller.js";
import { GuildVerificationRepository } from "./verification.repository.js";
import { GuildVerificationService } from "./verification.service.js";

const repository =
  new GuildVerificationRepository();

const battleNetRepository =
  new BattleNetRepository();

const battleNetClient =
  new BattleNetClient();

export const guildVerificationService =
  new GuildVerificationService(
    repository,
    battleNetRepository,
    battleNetClient
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
