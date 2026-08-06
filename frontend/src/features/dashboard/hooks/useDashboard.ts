import {
  useEffect,
  useState
} from "react";
import { getDashboardSummary } from "../api/dashboardApi";
import type { DashboardSummary } from "../types/dashboard.types";

type DashboardState = {
  summary: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
};

export function useDashboard():
  DashboardState {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        setSummary(
          await getDashboardSummary()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Dashboard konnte nicht geladen werden."
        );
      }
      finally {
        setIsLoading(false);
      }
    }

    void loadSummary();
  }, []);

  return {
    summary,
    isLoading,
    error
  };
}