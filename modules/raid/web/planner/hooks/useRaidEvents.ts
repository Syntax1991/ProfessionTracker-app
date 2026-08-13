import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createRaidEvent as createRaidEventRequest,
  deleteRaidEvent as deleteRaidEventRequest,
  getRaidEvents,
  updateRaidEvent as updateRaidEventRequest
} from "../api/raidEventApi";
import type {
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";

export function useRaidEvents() {
  const [events, setEvents] =
    useState<RaidEvent[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadEvents = useCallback(
    async () => {
      setError(null);

      try {
        const response =
          await getRaidEvents();

        setEvents(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Raid events could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const createEvent = async (
    input: RaidEventInput
  ) => {
    setError(null);

    try {
      await createRaidEventRequest(
        input
      );

      await loadEvents();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Raid event could not be created.";

      setError(message);
      throw createError;
    }
  };

  const updateEvent = async (
    eventId: string,
    input: RaidEventInput
  ) => {
    setError(null);

    try {
      await updateRaidEventRequest(
        eventId,
        input
      );

      await loadEvents();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Raid event could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const deleteEvent = async (
    eventId: string
  ) => {
    setError(null);

    try {
      await deleteRaidEventRequest(
        eventId
      );

      await loadEvents();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Raid event could not be deleted.";

      setError(message);
      throw deleteError;
    }
  };

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent
  };
}
