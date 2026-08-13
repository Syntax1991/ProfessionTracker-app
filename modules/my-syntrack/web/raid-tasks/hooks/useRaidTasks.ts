import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createRaidTask,
  deleteRaidTask,
  getRaidTaskOverview,
  setRaidTaskCompletion
} from "../api/raidTaskApi";
import type {
  PersonalRaidTaskInput,
  RaidTaskOverview
} from "../types/raidTask.types";

export function useRaidTasks() {
  const [overview, setOverview] =
    useState<RaidTaskOverview | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [pendingAction, setPendingAction] =
    useState<string | null>(null);

  const loadOverview = useCallback(
    async () => {
      setError(null);

      try {
        setOverview(
          await getRaidTaskOverview()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Raid tasks could not be loaded."
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

  const addTask = async (
    characterId: string,
    input: PersonalRaidTaskInput
  ) => {
    setError(null);
    setPendingAction("create");

    try {
      setOverview(
        await createRaidTask(
          characterId,
          input
        )
      );

      return true;
    }
    catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Raid task could not be created."
      );

      return false;
    }
    finally {
      setPendingAction(null);
    }
  };

  const updateCompletion = async (
    taskId: string,
    completed: boolean
  ) => {
    setError(null);
    setPendingAction(taskId);

    try {
      setOverview(
        await setRaidTaskCompletion(
          taskId,
          completed
        )
      );
    }
    catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Raid task could not be updated."
      );
    }
    finally {
      setPendingAction(null);
    }
  };

  const removeTask = async (
    taskId: string
  ) => {
    setError(null);
    setPendingAction(taskId);

    try {
      setOverview(
        await deleteRaidTask(taskId)
      );
    }
    catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Raid task could not be removed."
      );
    }
    finally {
      setPendingAction(null);
    }
  };

  return {
    overview,
    isLoading,
    error,
    pendingAction,
    addTask,
    updateCompletion,
    removeTask
  };
}
