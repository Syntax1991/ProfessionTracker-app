import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  addSetupMembers,
  getSetupForEvent,
  removeSetupMember,
  updateSetupRosterFromTeam
} from "../api/raidSetupApi";
import type { RaidSetup } from "../types/raidSetup.types";

export function useRaidSetup(
  eventId: string | null
) {
  const [setup, setSetup] =
    useState<RaidSetup | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadSetup = useCallback(
    async () => {
      if (!eventId) {
        setSetup(null);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getSetupForEvent(
            eventId
          );

        setSetup(response);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Setup could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  useEffect(() => {
    void loadSetup();
  }, [loadSetup]);

  const addMembers = async (
    memberIds: string[]
  ) => {
    if (!setup) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response =
        await addSetupMembers(
          setup.id,
          memberIds
        );

      setSetup(response);
    }
    catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : "Member could not be added."
      );

      throw addError;
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const removeMember = async (
    memberId: string
  ) => {
    if (!setup) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response =
        await removeSetupMember(
          setup.id,
          memberId
        );

      setSetup(response);
    }
    catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Member could not be removed."
      );

      throw removeError;
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const updateRosterFromTeam = async () => {
    if (!setup) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response =
        await updateSetupRosterFromTeam(
          setup.id
        );

      setSetup(response);
    }
    catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Roster could not be synced."
      );

      throw updateError;
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return {
    setup,
    isLoading,
    isSubmitting,
    error,
    addMembers,
    removeMember,
    updateRosterFromTeam
  };
}
