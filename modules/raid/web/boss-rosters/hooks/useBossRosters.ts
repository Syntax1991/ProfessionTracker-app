import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  clearBossRosterEntry,
  createBoss,
  deleteBoss,
  getBossesForEvent,
  setBossRosterEntry,
  updateBoss
} from "../api/bossRosterApi";
import type {
  RaidBoss,
  RaidBossInput,
  RaidBossRosterStatus
} from "../types/bossRoster.types";

export function useBossRosters(
  eventId: string | null
) {
  const [bosses, setBosses] =
    useState<RaidBoss[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadBosses = useCallback(
    async () => {
      if (!eventId) {
        setBosses([]);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getBossesForEvent(
            eventId
          );

        setBosses(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Bosses could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  useEffect(() => {
    void loadBosses();
  }, [loadBosses]);

  const addBoss = async (
    input: RaidBossInput
  ) => {
    if (!eventId) {
      return;
    }

    setError(null);

    try {
      await createBoss(
        eventId,
        input
      );

      await loadBosses();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Boss could not be added.";

      setError(message);
      throw createError;
    }
  };

  const editBoss = async (
    bossId: string,
    input: RaidBossInput
  ) => {
    setError(null);

    try {
      await updateBoss(
        bossId,
        input
      );

      await loadBosses();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Boss could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const removeBoss = async (
    bossId: string
  ) => {
    setError(null);

    try {
      await deleteBoss(bossId);
      await loadBosses();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Boss could not be removed.";

      setError(message);
      throw deleteError;
    }
  };

  const setEntry = async (
    bossId: string,
    memberId: string,
    status: RaidBossRosterStatus
  ) => {
    setError(null);

    try {
      await setBossRosterEntry(
        bossId,
        memberId,
        status
      );

      await loadBosses();
    }
    catch (setEntryError) {
      const message =
        setEntryError instanceof Error
          ? setEntryError.message
          : "Status could not be set.";

      setError(message);
      throw setEntryError;
    }
  };

  const clearEntry = async (
    bossId: string,
    memberId: string
  ) => {
    setError(null);

    try {
      await clearBossRosterEntry(
        bossId,
        memberId
      );

      await loadBosses();
    }
    catch (clearEntryError) {
      const message =
        clearEntryError instanceof Error
          ? clearEntryError.message
          : "Status could not be cleared.";

      setError(message);
      throw clearEntryError;
    }
  };

  return {
    bosses,
    isLoading,
    error,
    addBoss,
    editBoss,
    removeBoss,
    setEntry,
    clearEntry
  };
}
