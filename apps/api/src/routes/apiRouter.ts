import { Router } from "express";
import { guildRosterRouter } from "../../../../modules/guild/api/roster/roster.routes.js";
import { guildRosterImportRouter } from "../../../../modules/guild/api/roster-import/roster-import.routes.js";
import { guildVerificationRouter } from "../../../../modules/guild/api/verification/verification.routes.js";
import { characterRouter } from "../../../../modules/my-syntrack/api/characters/character.routes.js";
import { dashboardRouter } from "../../../../modules/my-syntrack/api/dashboard/dashboard.routes.js";
import { gearReadinessRouter } from "../../../../modules/my-syntrack/api/gear-readiness/gear-readiness.routes.js";
import { raidTaskRouter } from "../../../../modules/my-syntrack/api/raid-tasks/raid-task.routes.js";
import { weeklyChecklistRouter } from "../../../../modules/my-syntrack/api/weekly-checklist/weekly-checklist.routes.js";
import { vaultMythicPlusRouter } from "../../../../modules/my-syntrack/api/vault-mythic-plus/vault-mythic-plus.routes.js";
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
  "/weekly-checklist",
  weeklyChecklistRouter
);

apiRouter.use(
  "/vault-mythic-plus",
  vaultMythicPlusRouter
);

apiRouter.use(
  "/raid-tasks",
  raidTaskRouter
);

apiRouter.use(
  "/gear-readiness",
  gearReadinessRouter
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
  "/guild/verification",
  guildVerificationRouter
);

apiRouter.use(
  "/guild/roster",
  guildRosterRouter
);

apiRouter.use(
  "/guild/roster-import",
  guildRosterImportRouter
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
