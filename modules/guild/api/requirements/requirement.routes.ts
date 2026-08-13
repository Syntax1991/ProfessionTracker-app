import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { guildVerificationService } from "../verification/verification.routes.js";
import { GuildRequirementController } from "./requirement.controller.js";
import { GuildRequirementRepository } from "./requirement.repository.js";
import { GuildRequirementService } from "./requirement.service.js";

const repository =
  new GuildRequirementRepository();

const service =
  new GuildRequirementService(
    repository,
    guildVerificationService
  );

const controller =
  new GuildRequirementController(
    service
  );

export const guildRequirementRouter =
  Router();

guildRequirementRouter.get(
  "/",
  asyncHandler(controller.list)
);

guildRequirementRouter.post(
  "/",
  asyncHandler(controller.create)
);

guildRequirementRouter.put(
  "/:requirementId",
  asyncHandler(controller.update)
);

guildRequirementRouter.delete(
  "/:requirementId",
  asyncHandler(controller.delete)
);
