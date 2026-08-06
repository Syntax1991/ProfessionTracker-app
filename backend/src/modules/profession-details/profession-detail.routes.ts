import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { ProfessionDetailController } from "./profession-detail.controller.js";
import { ProfessionDetailRepository } from "./profession-detail.repository.js";
import { ProfessionDetailService } from "./profession-detail.service.js";

const repository =
  new ProfessionDetailRepository();

const service =
  new ProfessionDetailService(
    repository
  );

const controller =
  new ProfessionDetailController(
    service
  );

export const professionDetailRouter =
  Router();

professionDetailRouter.get(
  "/",
  asyncHandler(
    controller.getOverview
  )
);

professionDetailRouter.get(
  "/:professionId",
  asyncHandler(
    controller.getDetail
  )
);