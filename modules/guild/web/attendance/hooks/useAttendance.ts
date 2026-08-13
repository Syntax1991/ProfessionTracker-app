import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  clearGuildAttendanceRecord,
  createGuildAttendanceEvent,
  deleteGuildAttendanceEvent,
  getGuildAttendanceEvents,
  setGuildAttendanceRecord,
  updateGuildAttendanceEvent
} from "../api/attendanceApi";
import type {
  GuildAttendanceEvent,
  GuildAttendanceEventInput,
  GuildAttendanceStatus
} from "../types/attendance.types";

export function useAttendance() {
  const [events, setEvents] =
    useState<GuildAttendanceEvent[]>(
      []
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadEvents = useCallback(
    async () => {
      setError(null);

      try {
        const response =
          await getGuildAttendanceEvents();

        setEvents(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Attendance events could not be loaded."
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
    input: GuildAttendanceEventInput
  ) => {
    setError(null);

    try {
      await createGuildAttendanceEvent(
        input
      );

      await loadEvents();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Event could not be created.";

      setError(message);
      throw createError;
    }
  };

  const updateEvent = async (
    eventId: string,
    input: GuildAttendanceEventInput
  ) => {
    setError(null);

    try {
      await updateGuildAttendanceEvent(
        eventId,
        input
      );

      await loadEvents();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Event could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const deleteEvent = async (
    eventId: string
  ) => {
    setError(null);

    try {
      await deleteGuildAttendanceEvent(
        eventId
      );

      await loadEvents();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Event could not be deleted.";

      setError(message);
      throw deleteError;
    }
  };

  const setRecord = async (
    eventId: string,
    memberId: string,
    status: GuildAttendanceStatus
  ) => {
    setError(null);

    try {
      await setGuildAttendanceRecord(
        eventId,
        memberId,
        status
      );

      await loadEvents();
    }
    catch (setError_) {
      const message =
        setError_ instanceof Error
          ? setError_.message
          : "Attendance could not be recorded.";

      setError(message);
      throw setError_;
    }
  };

  const clearRecord = async (
    eventId: string,
    memberId: string
  ) => {
    setError(null);

    try {
      await clearGuildAttendanceRecord(
        eventId,
        memberId
      );

      await loadEvents();
    }
    catch (clearError) {
      const message =
        clearError instanceof Error
          ? clearError.message
          : "Attendance could not be cleared.";

      setError(message);
      throw clearError;
    }
  };

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    setRecord,
    clearRecord
  };
}
