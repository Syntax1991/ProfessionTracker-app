import { Router } from "express";
import { characterRouter } from "../modules/characters/character.routes.js";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes.js";
import {
  battleNetAuthRouter,
  battleNetIntegrationRouter
} from "../modules/integrations/battlenet/battlenet.routes.js";
import { professionRouter } from "../modules/professions/profession.routes.js";

export const apiRouter = Router();

apiRouter.get(
  "/health",
  (_request, response) => {
    response.json({
      ok: true,
      service:
        "Profession Tracker API",
      timestamp:
        new Date().toISOString()
    });
  }
);

apiRouter.use(
  "/dashboard",
  dashboardRouter
);

apiRouter.use(
  "/characters",
  characterRouter
);

apiRouter.use(
  "/professions",
  professionRouter
);

apiRouter.use(
  "/integrations/battlenet",
  battleNetIntegrationRouter
);

apiRouter.use(
  "/auth/battlenet",
  battleNetAuthRouter
);