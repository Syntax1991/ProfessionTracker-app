import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { CharactersPage } from "../../../../modules/my-syntrack/web/characters/pages/CharactersPage";
import { DashboardPage } from "../../../../modules/my-syntrack/web/dashboard/pages/DashboardPage";
import { AddonImportPage } from "../../../../modules/data-platform/web/integrations/pages/AddonImportPage";
import { BattleNetPage } from "../../../../modules/data-platform/web/integrations/pages/BattleNetPage";
import { ProfessionDetailPage } from "../../../../modules/professions/web/details/pages/ProfessionDetailPage";
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
          path="professions"
          element={
            <ProfessionsPage />
          }
        />

        <Route
          path="professions/:professionId"
          element={
            <ProfessionDetailPage />
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