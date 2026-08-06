import { Router } from "express";
import { BattleNetController } from "./battlenet.controller.js";
import { BattleNetService } from "./battlenet.service.js";

const service =
  new BattleNetService();

const controller =
  new BattleNetController(
    service
  );

export const battleNetRouter =
  Router();

battleNetRouter.get(
  "/status",
  controller.getStatus
);