import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { RosterPage } from "../../../../modules/guild/web/roster/pages/RosterPage";
import { TeamsPage } from "../../../../modules/guild/web/teams/pages/TeamsPage";
import { CharactersPage } from "../../../../modules/my-syntrack/web/characters/pages/CharactersPage";
import { DashboardPage } from "../../../../modules/my-syntrack/web/dashboard/pages/DashboardPage";
import { GearReadinessPage } from "../../../../modules/my-syntrack/web/gear-readiness/pages/GearReadinessPage";
import { RaidTasksPage } from "../../../../modules/my-syntrack/web/raid-tasks/pages/RaidTasksPage";
import { WeeklyChecklistPage } from "../../../../modules/my-syntrack/web/weekly-checklist/pages/WeeklyChecklistPage";
import { VaultMythicPlusPage } from "../../../../modules/my-syntrack/web/vault-mythic-plus/pages/VaultMythicPlusPage";
import { AddonImportPage } from "../../../../modules/data-platform/web/integrations/pages/AddonImportPage";
import { BattleNetPage } from "../../../../modules/data-platform/web/integrations/pages/BattleNetPage";
import { ProfessionDetailPage } from "../../../../modules/professions/web/details/pages/ProfessionDetailPage";
import { ProfessionCrafterFinderPage } from "../../../../modules/professions/web/pages/ProfessionCrafterFinderPage";
import { ProfessionKnowledgePage } from "../../../../modules/professions/web/pages/ProfessionKnowledgePage";
import { ProfessionRecipeWorkspacePage } from "../../../../modules/professions/web/pages/ProfessionRecipeWorkspacePage";
import { ProfessionSpecializationsPage } from "../../../../modules/professions/web/pages/ProfessionSpecializationsPage";
import { ProfessionsPage } from "../../../../modules/professions/web/pages/ProfessionsPage";
import { CharacterSpecializationsPage } from "../../../../modules/professions/web/specializations/pages/CharacterSpecializationsPage";
import { AppLayout } from "../shared/layouts/AppLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={
            <DashboardPage />
          }
        />

        <Route
          path="characters"
          element={
            <CharactersPage />
          }
        />

        <Route
          path="characters/:characterId"
          element={
            <CharacterSpecializationsPage />
          }
        />

        <Route
          path="characters/:characterId/specializations"
          element={
            <CharacterSpecializationsPage />
          }
        />

        <Route
          path="weekly-checklist"
          element={
            <WeeklyChecklistPage />
          }
        />

        <Route
          path="vault-mythic-plus"
          element={
            <VaultMythicPlusPage />
          }
        />

        <Route
          path="raid-tasks"
          element={
            <RaidTasksPage />
          }
        />

        <Route
          path="gear-readiness"
          element={
            <GearReadinessPage />
          }
        />

        <Route
          path="professions"
          element={
            <ProfessionsPage />
          }
        />

        <Route
          path="professions/crafters"
          element={
            <ProfessionCrafterFinderPage />
          }
        />

        <Route
          path="professions/recipes"
          element={
            <ProfessionRecipeWorkspacePage mode="catalog" />
          }
        />

        <Route
          path="professions/knowledge"
          element={
            <ProfessionKnowledgePage />
          }
        />

        <Route
          path="professions/specializations"
          element={
            <ProfessionSpecializationsPage />
          }
        />

        <Route
          path="professions/material-quality"
          element={
            <ProfessionRecipeWorkspacePage mode="material-quality" />
          }
        />

        <Route
          path="professions/concentration"
          element={
            <ProfessionRecipeWorkspacePage mode="concentration" />
          }
        />

        <Route
          path="professions/recommendations"
          element={
            <ProfessionRecipeWorkspacePage mode="recommendations" />
          }
        />

        <Route
          path="professions/:professionId"
          element={
            <ProfessionDetailPage />
          }
        />

        <Route
          path="guild/roster"
          element={
            <RosterPage />
          }
        />

        <Route
          path="guild/teams"
          element={
            <TeamsPage />
          }
        />

        <Route
          path="addon"
          element={
            <AddonImportPage />
          }
        />

        <Route
          path="battlenet"
          element={
            <BattleNetPage />
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            replace
            to="/"
          />
        }
      />
    </Routes>
  );
}
