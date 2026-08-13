import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { guildVerificationService } from "../verification/verification.routes.js";
import { GuildAttendanceController } from "./attendance.controller.js";
import { GuildAttendanceRepository } from "./attendance.repository.js";
import { GuildAttendanceService } from "./attendance.service.js";

const repository =
  new GuildAttendanceRepository();

const service =
  new GuildAttendanceService(
    repository,
    guildVerificationService
  );

const controller =
  new GuildAttendanceController(
    service
  );

export const guildAttendanceRouter =
  Router();

guildAttendanceRouter.get(
  "/events",
  asyncHandler(
    controller.listEvents
  )
);

guildAttendanceRouter.post(
  "/events",
  asyncHandler(
    controller.createEvent
  )
);

guildAttendanceRouter.put(
  "/events/:eventId",
  asyncHandler(
    controller.updateEvent
  )
);

guildAttendanceRouter.delete(
  "/events/:eventId",
  asyncHandler(
    controller.deleteEvent
  )
);

guildAttendanceRouter.put(
  "/events/:eventId/records/:memberId",
  asyncHandler(
    controller.setRecord
  )
);

guildAttendanceRouter.delete(
  "/events/:eventId/records/:memberId",
  asyncHandler(
    controller.clearRecord
  )
);
