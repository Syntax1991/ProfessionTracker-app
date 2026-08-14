import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createCooldownAssignment,
  deleteCooldownAssignment,
  getCooldownAssignmentsForEvent,
  updateCooldownAssignment
} from "../api/cooldownApi";
import type {
  RaidCooldownAssignment,
  RaidCooldownAssignmentInput
} from "../types/cooldown.types";

export function useCooldownAssignments(
  eventId: string | null
) {
  const [
    assignments,
    setAssignments
  ] = useState<
    RaidCooldownAssignment[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadAssignments =
    useCallback(async () => {
      if (!eventId) {
        setAssignments([]);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getCooldownAssignmentsForEvent(
            eventId
          );

        setAssignments(
          response.items
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Cooldown assignments could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    }, [eventId]);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const addAssignment = async (
    bossId: string,
    input: RaidCooldownAssignmentInput
  ) => {
    setError(null);

    try {
      await createCooldownAssignment(
        bossId,
        input
      );

      await loadAssignments();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Assignment could not be added.";

      setError(message);
      throw createError;
    }
  };

  const editAssignment = async (
    assignmentId: string,
    input: RaidCooldownAssignmentInput
  ) => {
    setError(null);

    try {
      await updateCooldownAssignment(
        assignmentId,
        input
      );

      await loadAssignments();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Assignment could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const removeAssignment = async (
    assignmentId: string
  ) => {
    setError(null);

    try {
      await deleteCooldownAssignment(
        assignmentId
      );

      await loadAssignments();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Assignment could not be removed.";

      setError(message);
      throw deleteError;
    }
  };

  return {
    assignments,
    isLoading,
    error,
    addAssignment,
    editAssignment,
    removeAssignment
  };
}
