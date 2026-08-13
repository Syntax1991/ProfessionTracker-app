import express, {
  Router
} from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { guildVerificationService } from "../verification/verification.routes.js";
import { GuildRosterImportController } from "./roster-import.controller.js";
import { GuildRosterImportPersistence } from "./roster-import.persistence.js";
import { GuildRosterImportService } from "./roster-import.service.js";

const persistence =
  new GuildRosterImportPersistence();

const service =
  new GuildRosterImportService(
    persistence,
    guildVerificationService
  );

const controller =
  new GuildRosterImportController(
    service
  );

const savedVariablesBody =
  express.text({
    type:
      "text/plain",
    limit:
      "25mb"
  });

export const guildRosterImportRouter =
  Router();

guildRosterImportRouter.post(
  "/preview",
  savedVariablesBody,
  asyncHandler(
    controller.preview
  )
);

guildRosterImportRouter.post(
  "/import",
  savedVariablesBody,
  asyncHandler(
    controller
      .importSavedVariables
  )
);
