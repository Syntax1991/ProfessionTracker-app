import { Router } from "express";
import { asyncHandler } from "../../../../apps/api/src/shared/http/asyncHandler.js";
import { guildVerificationService } from "../verification/verification.routes.js";
import { GuildOfficerNoteController } from "./officer-note.controller.js";
import { GuildOfficerNoteRepository } from "./officer-note.repository.js";
import { GuildOfficerNoteService } from "./officer-note.service.js";

const repository =
  new GuildOfficerNoteRepository();

const service =
  new GuildOfficerNoteService(
    repository,
    guildVerificationService
  );

const controller =
  new GuildOfficerNoteController(
    service
  );

export const guildOfficerNoteRouter =
  Router();

guildOfficerNoteRouter.get(
  "/count",
  asyncHandler(controller.count)
);

guildOfficerNoteRouter.get(
  "/member/:memberId",
  asyncHandler(
    controller.listForMember
  )
);

guildOfficerNoteRouter.post(
  "/",
  asyncHandler(controller.create)
);

guildOfficerNoteRouter.delete(
  "/:noteId",
  asyncHandler(controller.delete)
);
