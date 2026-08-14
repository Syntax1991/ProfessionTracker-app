import { useCallback, useEffect, useState } from "react";
import { raiderLogout } from "../../../../data-platform/web/raider-auth/api/raiderAuthApi";
import {
  clearRaiderSessionToken,
  getRaiderSessionToken
} from "../../../../../apps/web/src/shared/api/raiderSession";
import {
  claimRaiderLink,
  resolveRaiderLink
} from "../api/raiderLinkApi";
import type { RaiderLinkResolution } from "../types/raiderLink.types";

export function useRaiderLink() {
  const [
    isLoggedIn,
    setIsLoggedIn
  ] = useState(
    Boolean(getRaiderSessionToken())
  );

  const [resolution, setResolution] =
    useState<RaiderLinkResolution | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(isLoggedIn);

  const [isClaiming, setIsClaiming] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const resolve = useCallback(
    async () => {
      if (!getRaiderSessionToken()) {
        setIsLoggedIn(false);
        setResolution(null);
        setIsLoading(false);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        setIsLoggedIn(true);

        setResolution(
          await resolveRaiderLink()
        );
      }
      catch (resolveError) {
        setError(
          resolveError instanceof Error
            ? resolveError.message
            : "Raider-Login could not be resolved."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void resolve();
  }, [resolve]);

  const claim = async (
    memberId: string
  ) => {
    setError(null);
    setIsClaiming(true);

    try {
      const member =
        await claimRaiderLink(
          memberId
        );

      setResolution({
        status: "linked",
        member
      });
    }
    catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : "Character could not be claimed."
      );
    }
    finally {
      setIsClaiming(false);
    }
  };

  const logout = async () => {
    setError(null);

    try {
      await raiderLogout();
    }
    catch {
      // Session may already be expired server-side; still clear it locally.
    }

    clearRaiderSessionToken();
    setIsLoggedIn(false);
    setResolution(null);
  };

  return {
    isLoggedIn,
    resolution,
    isLoading,
    isClaiming,
    error,
    claim,
    logout
  };
}
