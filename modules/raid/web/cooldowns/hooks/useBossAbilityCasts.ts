import {
  useCallback,
  useEffect,
  useState
} from "react";
import { getAbilityCastsForBoss } from "../api/cooldownApi";
import type { RaidBossAbilityCast } from "../types/cooldown.types";

export function useBossAbilityCasts(
  bossId: string | null
) {
  const [casts, setCasts] = useState<
    RaidBossAbilityCast[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const reload = useCallback(
    async () => {
      if (!bossId) {
        setCasts([]);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getAbilityCastsForBoss(
            bossId
          );

        setCasts(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Boss abilities could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    [bossId]
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    casts,
    isLoading,
    error,
    reload
  };
}
