import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import { BattleNetRepository } from "../../../data-platform/api/integrations/battlenet/battlenet.repository.js";
import { guildVerificationService } from "../verification/verification.routes.js";
import { GuildAuditController } from "./audit.controller.js";
import { GuildAuditRepository } from "./audit.repository.js";
import { GuildAuditService } from "./audit.service.js";

const repository =
  new GuildAuditRepository();

const battleNetRepository =
  new BattleNetRepository();

const battleNetClient =
  new BattleNetClient();

const service =
  new GuildAuditService(
    repository,
    battleNetRepository,
    battleNetClient,
    guildVerificationService
  );

const controller =
  new GuildAuditController(
    service
  );

export const guildAuditRouter =
  Router();

guildAuditRouter.post(
  "/refresh",
  asyncHandler(
    controller.refreshAll
  )
);
