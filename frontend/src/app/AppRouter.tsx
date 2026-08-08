import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { CharactersPage } from "../features/characters/pages/CharactersPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { AddonImportPage } from "../features/integrations/pages/AddonImportPage";
import { BattleNetPage } from "../features/integrations/pages/BattleNetPage";
import { ProfessionDetailPage } from "../features/profession-details/pages/ProfessionDetailPage";
import { ProfessionsPage } from "../features/professions/pages/ProfessionsPage";
import { CharacterSpecializationsPage } from "../features/specializations/pages/CharacterSpecializationsPage";
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