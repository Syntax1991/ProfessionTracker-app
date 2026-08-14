import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  clearMyDroptimizerReport,
  getMyDroptimizerReport,
  setMyDroptimizerReport
} from "../api/droptimizerApi";
import type { MyDroptimizerReport } from "../types/droptimizer.types";

export function useMyDroptimizerReport() {
  const [report, setReport] =
    useState<MyDroptimizerReport | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(
    async () => {
      setError(null);
      setIsLoading(true);

      try {
        setReport(
          await getMyDroptimizerReport()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Der Droptimizer-Report konnte nicht geladen werden."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void load();
  }, [load]);

  const submitReportUrl = async (
    reportUrl: string
  ) => {
    setError(null);

    try {
      setReport(
        await setMyDroptimizerReport(
          reportUrl
        )
      );
    }
    catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Der Report konnte nicht übernommen werden.";

      setError(message);
      throw submitError;
    }
  };

  const clearReport = async () => {
    setError(null);

    try {
      await clearMyDroptimizerReport();
      setReport(null);
    }
    catch (clearError) {
      const message =
        clearError instanceof Error
          ? clearError.message
          : "Der Report konnte nicht entfernt werden.";

      setError(message);
      throw clearError;
    }
  };

  return {
    report,
    isLoading,
    error,
    submitReportUrl,
    clearReport
  };
}
