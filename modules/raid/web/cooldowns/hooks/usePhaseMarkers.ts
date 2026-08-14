import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createPhaseMarker,
  deletePhaseMarker,
  getPhaseMarkersForBoss
} from "../api/cooldownApi";
import type {
  RaidBossPhaseMarker,
  RaidBossPhaseMarkerInput
} from "../types/cooldown.types";

export function usePhaseMarkers(
  bossId: string | null
) {
  const [markers, setMarkers] =
    useState<
      RaidBossPhaseMarker[]
    >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadMarkers = useCallback(
    async () => {
      if (!bossId) {
        setMarkers([]);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getPhaseMarkersForBoss(
            bossId
          );

        setMarkers(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Phase markers could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    [bossId]
  );

  useEffect(() => {
    void loadMarkers();
  }, [loadMarkers]);

  const addMarker = async (
    input: RaidBossPhaseMarkerInput
  ) => {
    if (!bossId) {
      return;
    }

    setError(null);

    try {
      await createPhaseMarker(
        bossId,
        input
      );

      await loadMarkers();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Phase marker could not be added.";

      setError(message);
      throw createError;
    }
  };

  const removeMarker = async (
    markerId: string
  ) => {
    setError(null);

    try {
      await deletePhaseMarker(
        markerId
      );

      await loadMarkers();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Phase marker could not be removed.";

      setError(message);
      throw deleteError;
    }
  };

  return {
    markers,
    isLoading,
    error,
    addMarker,
    removeMarker
  };
}
