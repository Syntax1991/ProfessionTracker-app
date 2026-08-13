import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  getWeeklyChecklist,
  updateAllWeeklyTasks,
  updateWeeklyTask
} from "../api/weeklyChecklistApi";
import type { WeeklyChecklistResponse } from "../types/weeklyChecklist.types";

type WeeklyChecklistState = {
  checklist: WeeklyChecklistResponse | null;
  isLoading: boolean;
  error: string | null;
  pendingAction: string | null;
  setTaskCompleted: (
    characterId: string,
    taskKey: string,
    completed: boolean
  ) => Promise<void>;
  setAllTasksCompleted: (
    characterId: string,
    completed: boolean
  ) => Promise<void>;
};

export function useWeeklyChecklist():
  WeeklyChecklistState {
  const [checklist, setChecklist] =
    useState<WeeklyChecklistResponse | null>(
      null
    );
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [pendingAction, setPendingAction] =
    useState<string | null>(null);

  const loadChecklist = useCallback(
    async () => {
      setError(null);

      try {
        setChecklist(
          await getWeeklyChecklist()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Weekly checklist could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadChecklist();
  }, [loadChecklist]);

  const runUpdate = async (
    actionKey: string,
    request: () =>
      Promise<WeeklyChecklistResponse>
  ) => {
    setError(null);
    setPendingAction(actionKey);

    try {
      setChecklist(await request());
    }
    catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Weekly progress could not be updated."
      );
    }
    finally {
      setPendingAction(null);
    }
  };

  const setTaskCompleted = async (
    characterId: string,
    taskKey: string,
    completed: boolean
  ) => {
    await runUpdate(
      `${characterId}:${taskKey}`,
      () =>
        updateWeeklyTask(
          characterId,
          taskKey,
          completed
        )
    );
  };

  const setAllTasksCompleted = async (
    characterId: string,
    completed: boolean
  ) => {
    await runUpdate(
      `${characterId}:all`,
      () =>
        updateAllWeeklyTasks(
          characterId,
          completed
        )
    );
  };

  return {
    checklist,
    isLoading,
    error,
    pendingAction,
    setTaskCompleted,
    setAllTasksCompleted
  };
}
