import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  clearGearSlot,
  getGearReadinessOverview,
  updateGearSlot
} from "../api/gearReadinessApi";
import type {
  GearReadinessOverview,
  GearSlotInput,
  GearSlotKey
} from "../types/gearReadiness.types";

export function useGearReadiness() {
  const [overview, setOverview] =
    useState<GearReadinessOverview | null>(
      null
    );
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [pendingSlotKey, setPendingSlotKey] =
    useState<GearSlotKey | null>(null);

  const loadOverview = useCallback(
    async () => {
      setError(null);

      try {
        setOverview(
          await getGearReadinessOverview()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gear readiness could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const saveSlot = async (
    characterId: string,
    slotKey: GearSlotKey,
    input: GearSlotInput
  ) => {
    setError(null);
    setPendingSlotKey(slotKey);

    try {
      setOverview(
        await updateGearSlot(
          characterId,
          slotKey,
          input
        )
      );

      return true;
    }
    catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Gear slot could not be saved."
      );

      return false;
    }
    finally {
      setPendingSlotKey(null);
    }
  };

  const clearSlot = async (
    characterId: string,
    slotKey: GearSlotKey
  ) => {
    setError(null);
    setPendingSlotKey(slotKey);

    try {
      setOverview(
        await clearGearSlot(
          characterId,
          slotKey
        )
      );

      return true;
    }
    catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Gear slot could not be cleared."
      );

      return false;
    }
    finally {
      setPendingSlotKey(null);
    }
  };

  return {
    overview,
    isLoading,
    error,
    pendingSlotKey,
    saveSlot,
    clearSlot
  };
}
