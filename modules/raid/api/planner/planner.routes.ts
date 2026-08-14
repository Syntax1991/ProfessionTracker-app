import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { GuildTeamRepository } from "../../../guild/api/teams/team.repository.js";
import { guildVerificationService } from "../../../guild/api/verification/verification.routes.js";
import { RaidBossRosterRepository } from "../boss-rosters/boss-roster.repository.js";
import { RaidPlannerController } from "./planner.controller.js";
import { RaidPlannerRepository } from "./planner.repository.js";
import { RaidPlannerService } from "./planner.service.js";

const repository =
  new RaidPlannerRepository();

const teamRepository =
  new GuildTeamRepository();

const bossRosterRepository =
  new RaidBossRosterRepository();

const service =
  new RaidPlannerService(
    repository,
    teamRepository,
    bossRosterRepository,
    guildVerificationService
  );

const controller =
  new RaidPlannerController(
    service
  );

export const raidPlannerRouter =
  Router();

raidPlannerRouter.get(
  "/",
  asyncHandler(controller.list)
);

raidPlannerRouter.post(
  "/",
  asyncHandler(controller.create)
);

raidPlannerRouter.put(
  "/:eventId",
  asyncHandler(controller.update)
);

raidPlannerRouter.delete(
  "/:eventId",
  asyncHandler(controller.delete)
);
