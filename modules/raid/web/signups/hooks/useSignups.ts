import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  clearSignup,
  getSignupsForEvent,
  setOwnSignup,
  setSignup
} from "../api/signupApi";
import type {
  RaidSignupEntry,
  RaidSignupStatus
} from "../types/signup.types";

export function useSignups(
  eventId: string | null
) {
  const [entries, setEntries] =
    useState<RaidSignupEntry[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadEntries = useCallback(
    async () => {
      if (!eventId) {
        setEntries([]);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getSignupsForEvent(
            eventId
          );

        setEntries(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Signups could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const setMemberStatus = async (
    memberId: string,
    status: RaidSignupStatus
  ) => {
    if (!eventId) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await setSignup(
        eventId,
        memberId,
        status
      );

      await loadEntries();
    }
    catch (setError_) {
      setError(
        setError_ instanceof Error
          ? setError_.message
          : "Status could not be set."
      );

      throw setError_;
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const setOwnStatus = async (
    status: RaidSignupStatus
  ) => {
    if (!eventId) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await setOwnSignup(
        eventId,
        status
      );

      await loadEntries();
    }
    catch (ownStatusError) {
      setError(
        ownStatusError instanceof
          Error
          ? ownStatusError.message
          : "Status could not be set."
      );

      throw ownStatusError;
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const clearMemberStatus = async (
    memberId: string
  ) => {
    if (!eventId) {
      return;
    }

    setError(null);

    try {
      await clearSignup(
        eventId,
        memberId
      );

      await loadEntries();
    }
    catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Status could not be cleared."
      );
    }
  };

  return {
    entries,
    isLoading,
    isSubmitting,
    error,
    setMemberStatus,
    setOwnStatus,
    clearMemberStatus
  };
}
