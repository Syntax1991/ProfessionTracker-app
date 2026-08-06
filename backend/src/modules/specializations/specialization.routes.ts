import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { SpecializationController } from "./specialization.controller.js";
import { SpecializationRepository } from "./specialization.repository.js";
import { SpecializationService } from "./specialization.service.js";

const repository =
  new SpecializationRepository();

const service =
  new SpecializationService(
    repository
  );

const controller =
  new SpecializationController(
    service
  );

export const specializationRouter =
  Router();

specializationRouter.get(
  "/:characterId/specializations",
  asyncHandler(
    controller.getCharacterOverview
  )
);

specializationRouter.put(
  "/:characterId/professions/:characterProfessionId/specializations",
  asyncHandler(
    controller.updateProfessionProgress
  )
);