import { Router } from "express";
import { characterRouter } from "../../../../modules/my-syntrack/api/characters/character.routes.js";
import { dashboardRouter } from "../../../../modules/my-syntrack/api/dashboard/dashboard.routes.js";
import { addonImportRouter } from "../../../../modules/data-platform/api/integrations/addon/addon-import.routes.js";
import {
  battleNetAuthRouter,
  battleNetIntegrationRouter
} from "../../../../modules/data-platform/api/integrations/battlenet/battlenet.routes.js";
import { professionDetailRouter } from "../../../../modules/professions/api/details/profession-detail.routes.js";
import { professionRouter } from "../../../../modules/professions/api/profession.routes.js";
import { specializationRouter } from "../../../../modules/professions/api/specializations/specialization.routes.js";

export const apiRouter =
  Router();

apiRouter.get(
  "/health",
  (
    _request,
    response
  ) => {
    response.json({
      ok: true,
      service:
        "SynTrack API",
      timestamp:
        new Date()
          .toISOString()
    });
  }
);

apiRouter.use(
  "/dashboard",
  dashboardRouter
);

apiRouter.use(
  "/characters",
  specializationRouter
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
  "/profession-details",
  professionDetailRouter
);

apiRouter.use(
  "/integrations/addon",
  addonImportRouter
);

apiRouter.use(
  "/integrations/battlenet",
  battleNetIntegrationRouter
);

apiRouter.use(
  "/auth/battlenet",
  battleNetAuthRouter
);