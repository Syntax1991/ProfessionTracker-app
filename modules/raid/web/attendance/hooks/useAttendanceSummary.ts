import {
  useCallback,
  useEffect,
  useState
} from "react";
import { getAttendanceSummary } from "../api/attendanceApi";
import type { RaidAttendanceSummaryEvent } from "../types/attendance.types";

export function useAttendanceSummary() {
  const [events, setEvents] =
    useState<
      RaidAttendanceSummaryEvent[]
    >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadEvents = useCallback(
    async () => {
      setError(null);

      try {
        const response =
          await getAttendanceSummary();

        setEvents(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Attendance could not be loaded."
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

  return {
    events,
    isLoading,
    error
  };
}
