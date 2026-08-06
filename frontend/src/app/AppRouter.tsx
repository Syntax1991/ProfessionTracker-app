import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { CharactersPage } from "../features/characters/pages/CharactersPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { BattleNetPage } from "../features/integrations/pages/BattleNetPage";
import { ProfessionsPage } from "../features/professions/pages/ProfessionsPage";
import { AppLayout } from "../shared/layouts/AppLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="characters"
          element={<CharactersPage />}
        />
        <Route
          path="professions"
          element={<ProfessionsPage />}
        />
        <Route
          path="battlenet"
          element={<BattleNetPage />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate replace to="/" />}
      />
    </Routes>
  );
}