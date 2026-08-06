import { Router } from "express";
import { asyncHandler } from "../../../shared/http/asyncHandler.js";
import { CharacterRepository } from "../../characters/character.repository.js";
import { ProfessionRepository } from "../../professions/profession.repository.js";
import { BattleNetAuthService } from "./battlenet-auth.service.js";
import { BattleNetClient } from "./battlenet.client.js";
import { BattleNetController } from "./battlenet.controller.js";
import { BattleNetImportService } from "./battlenet-import.service.js";
import { BattleNetRepository } from "./battlenet.repository.js";
import { BattleNetService } from "./battlenet.service.js";

const repository =
  new BattleNetRepository();

const client =
  new BattleNetClient();

const characterRepository =
  new CharacterRepository();

const professionRepository =
  new ProfessionRepository();

const authService =
  new BattleNetAuthService(
    repository,
    client,
    characterRepository
  );

const importService =
  new BattleNetImportService(
    repository,
    client,
    characterRepository,
    professionRepository
  );

const service =
  new BattleNetService(
    authService,
    importService
  );

const controller =
  new BattleNetController(
    service
  );

export const battleNetIntegrationRouter =
  Router();

export const battleNetAuthRouter =
  Router();

battleNetIntegrationRouter.get(
  "/connect",
  asyncHandler(
    controller.connect
  )
);

battleNetIntegrationRouter.get(
  "/status",
  asyncHandler(
    controller.getStatus
  )
);

battleNetIntegrationRouter.get(
  "/characters",
  asyncHandler(
    controller.listCharacters
  )
);

battleNetIntegrationRouter.post(
  "/import",
  asyncHandler(
    controller.importCharacters
  )
);

battleNetIntegrationRouter.post(
  "/disconnect",
  asyncHandler(
    controller.disconnect
  )
);

battleNetAuthRouter.get(
  "/callback",
  controller.callback
);