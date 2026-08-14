import {
  useCallback,
  useEffect,
  useState
} from "react";
import { getGuildGearSlots } from "../api/auditApi";
import type { GuildMemberGearSlot } from "../types/audit.types";

export function useGuildGearSlots() {
  const [gearSlots, setGearSlots] =
    useState<
      GuildMemberGearSlot[]
    >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const reload = useCallback(
    async () => {
      setError(null);

      try {
        const response =
          await getGuildGearSlots();

        setGearSlots(
          response.items
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gear slots could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    gearSlots,
    isLoading,
    error,
    reload
  };
}
