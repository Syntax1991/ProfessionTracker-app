import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { guildVerificationService } from "../../../guild/api/verification/verification.routes.js";
import { RaidCooldownController } from "./cooldown.controller.js";
import { RaidCooldownRepository } from "./cooldown.repository.js";
import { RaidCooldownService } from "./cooldown.service.js";

const repository =
  new RaidCooldownRepository();

const service = new RaidCooldownService(
  repository,
  guildVerificationService
);

const controller =
  new RaidCooldownController(service);

export const raidCooldownRouter =
  Router();

raidCooldownRouter.get(
  "/events/:eventId",
  asyncHandler(
    controller.listForEvent
  )
);

raidCooldownRouter.post(
  "/bosses/:bossId",
  asyncHandler(
    controller.createAssignment
  )
);

raidCooldownRouter.put(
  "/:assignmentId",
  asyncHandler(
    controller.updateAssignment
  )
);

raidCooldownRouter.delete(
  "/:assignmentId",
  asyncHandler(
    controller.deleteAssignment
  )
);

raidCooldownRouter.put(
  "/bosses/:bossId/duration",
  asyncHandler(
    controller.updateFightDuration
  )
);

raidCooldownRouter.get(
  "/bosses/:bossId/phase-markers",
  asyncHandler(
    controller.listPhaseMarkers
  )
);

raidCooldownRouter.post(
  "/bosses/:bossId/phase-markers",
  asyncHandler(
    controller.createPhaseMarker
  )
);

raidCooldownRouter.delete(
  "/phase-markers/:markerId",
  asyncHandler(
    controller.deletePhaseMarker
  )
);
