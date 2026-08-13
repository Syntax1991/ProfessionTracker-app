import {
  useCallback,
  useEffect,
  useState
} from "react";
import { getGuildWeeklyProgress } from "../api/weeklyProgressApi";
import type { GuildWeeklyProgressSummary } from "../types/weeklyProgress.types";

export function useWeeklyProgress() {
  const [summary, setSummary] =
    useState<GuildWeeklyProgressSummary | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadSummary = useCallback(
    async () => {
      setError(null);

      try {
        setSummary(
          await getGuildWeeklyProgress()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Weekly progress could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  return {
    summary,
    isLoading,
    error,
    reload: loadSummary
  };
}
