import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { DashboardController } from "./dashboard.controller.js";
import { DashboardRepository } from "./dashboard.repository.js";
import { DashboardService } from "./dashboard.service.js";

const repository =
  new DashboardRepository();

const service =
  new DashboardService(
    repository
  );

const controller =
  new DashboardController(
    service
  );

export const dashboardRouter =
  Router();

dashboardRouter.get(
  "/",
  asyncHandler(
    controller.getSummary
  )
);