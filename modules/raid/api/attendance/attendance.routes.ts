import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { GuildRosterRepository } from "../../../guild/api/roster/roster.repository.js";
import { guildVerificationService } from "../../../guild/api/verification/verification.routes.js";
import { RaidAttendanceController } from "./attendance.controller.js";
import { RaidAttendanceRepository } from "./attendance.repository.js";
import { RaidAttendanceService } from "./attendance.service.js";

const repository =
  new RaidAttendanceRepository();

const rosterRepository =
  new GuildRosterRepository();

const service =
  new RaidAttendanceService(
    repository,
    rosterRepository,
    guildVerificationService
  );

const controller =
  new RaidAttendanceController(
    service
  );

export const raidAttendanceRouter =
  Router();

raidAttendanceRouter.get(
  "/summary",
  asyncHandler(
    controller.listSummary
  )
);

raidAttendanceRouter.get(
  "/events/:eventId",
  asyncHandler(
    controller.getEventAttendance
  )
);

raidAttendanceRouter.put(
  "/events/:eventId/members/:memberId",
  asyncHandler(
    controller.setRecord
  )
);

raidAttendanceRouter.delete(
  "/events/:eventId/members/:memberId",
  asyncHandler(
    controller.clearRecord
  )
);
