import { Outlet } from "react-router-dom";
import { AppNavigation } from "../components/AppNavigation";

export function AppLayout() {
  return (
    <div className="app-shell">
      <AppNavigation />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
