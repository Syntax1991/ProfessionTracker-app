import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { GuildRosterRepository } from "../../../guild/api/roster/roster.repository.js";
import { guildVerificationService } from "../../../guild/api/verification/verification.routes.js";
import { RaidBossRosterController } from "./boss-roster.controller.js";
import { RaidBossRosterRepository } from "./boss-roster.repository.js";
import { RaidBossRosterService } from "./boss-roster.service.js";

const repository =
  new RaidBossRosterRepository();

const rosterRepository =
  new GuildRosterRepository();

const service =
  new RaidBossRosterService(
    repository,
    rosterRepository,
    guildVerificationService
  );

const controller =
  new RaidBossRosterController(
    service
  );

export const raidBossRosterRouter =
  Router();

raidBossRosterRouter.get(
  "/events/:eventId",
  asyncHandler(
    controller.listForEvent
  )
);

raidBossRosterRouter.post(
  "/events/:eventId/bosses",
  asyncHandler(
    controller.createBoss
  )
);

raidBossRosterRouter.put(
  "/bosses/:bossId",
  asyncHandler(
    controller.updateBoss
  )
);

raidBossRosterRouter.delete(
  "/bosses/:bossId",
  asyncHandler(
    controller.deleteBoss
  )
);

raidBossRosterRouter.put(
  "/bosses/:bossId/members/:memberId",
  asyncHandler(
    controller.setEntry
  )
);

raidBossRosterRouter.delete(
  "/bosses/:bossId/members/:memberId",
  asyncHandler(
    controller.clearEntry
  )
);
