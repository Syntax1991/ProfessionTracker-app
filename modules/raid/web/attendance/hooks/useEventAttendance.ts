import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  clearAttendanceRecord,
  getEventAttendance,
  setAttendanceRecord
} from "../api/attendanceApi";
import type {
  RaidAttendanceRecord,
  RaidAttendanceStatus
} from "../types/attendance.types";

export function useEventAttendance(
  eventId: string | null
) {
  const [records, setRecords] =
    useState<RaidAttendanceRecord[]>(
      []
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadRecords = useCallback(
    async () => {
      if (!eventId) {
        setRecords([]);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getEventAttendance(
            eventId
          );

        setRecords(response.items);
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
    [eventId]
  );

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const setStatus = async (
    memberId: string,
    status: RaidAttendanceStatus
  ) => {
    if (!eventId) {
      return;
    }

    setError(null);

    try {
      const response =
        await setAttendanceRecord(
          eventId,
          memberId,
          status
        );

      setRecords(response.items);
    }
    catch (setStatusError) {
      const message =
        setStatusError instanceof Error
          ? setStatusError.message
          : "Attendance could not be recorded.";

      setError(message);
      throw setStatusError;
    }
  };

  const clearStatus = async (
    memberId: string
  ) => {
    if (!eventId) {
      return;
    }

    setError(null);

    try {
      const response =
        await clearAttendanceRecord(
          eventId,
          memberId
        );

      setRecords(response.items);
    }
    catch (clearStatusError) {
      const message =
        clearStatusError instanceof Error
          ? clearStatusError.message
          : "Attendance could not be cleared.";

      setError(message);
      throw clearStatusError;
    }
  };

  return {
    records,
    isLoading,
    error,
    setStatus,
    clearStatus
  };
}
