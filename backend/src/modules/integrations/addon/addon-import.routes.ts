import express, {
  Router
} from "express";
import { asyncHandler } from "../../../shared/http/asyncHandler.js";
import { AddonImportController } from "./addon-import.controller.js";
import { AddonImportPersistence } from "./addon-import.persistence.js";
import { AddonImportService } from "./addon-import.service.js";

const persistence =
  new AddonImportPersistence();

const service =
  new AddonImportService(
    persistence
  );

const controller =
  new AddonImportController(
    service
  );

const savedVariablesBody =
  express.text({
    type:
      "text/plain",
    limit:
      "25mb"
  });

export const addonImportRouter =
  Router();

addonImportRouter.post(
  "/preview",
  savedVariablesBody,
  asyncHandler(
    controller.preview
  )
);

addonImportRouter.post(
  "/import",
  savedVariablesBody,
  asyncHandler(
    controller
      .importSavedVariables
  )
);