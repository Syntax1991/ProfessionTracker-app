import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { ProfessionController } from "./profession.controller.js";
import { ProfessionRepository } from "./profession.repository.js";
import { ProfessionService } from "./profession.service.js";

const repository =
  new ProfessionRepository();

const service =
  new ProfessionService(
    repository
  );

const controller =
  new ProfessionController(
    service
  );

export const professionRouter =
  Router();

professionRouter.get(
  "/",
  asyncHandler(controller.list)
);