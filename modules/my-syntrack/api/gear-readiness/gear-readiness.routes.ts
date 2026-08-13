import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { GearReadinessController } from "./gear-readiness.controller.js";
import { GearReadinessRepository } from "./gear-readiness.repository.js";
import { GearReadinessService } from "./gear-readiness.service.js";

const repository =
  new GearReadinessRepository();
const service =
  new GearReadinessService(repository);
const controller =
  new GearReadinessController(service);

export const gearReadinessRouter = Router();

gearReadinessRouter.get(
  "/",
  asyncHandler(controller.getOverview)
);

gearReadinessRouter.put(
  "/:characterId/slots/:slotKey",
  asyncHandler(controller.updateSlot)
);

gearReadinessRouter.delete(
  "/:characterId/slots/:slotKey",
  asyncHandler(controller.clearSlot)
);
