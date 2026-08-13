import { useState } from "react";
import { refreshGuildAudit } from "../api/auditApi";
import type { GuildAuditRefreshResult } from "../types/audit.types";

export function useGuildAudit(
  onRefreshed: () => void
) {
  const [
    isRefreshing,
    setIsRefreshing
  ] = useState(false);

  const [result, setResult] =
    useState<GuildAuditRefreshResult | null>(
      null
    );

  const [error, setError] =
    useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    setIsRefreshing(true);

    try {
      const nextResult =
        await refreshGuildAudit();

      setResult(nextResult);
      onRefreshed();
    }
    catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Audit could not be refreshed."
      );
    }
    finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    result,
    error,
    refresh
  };
}
