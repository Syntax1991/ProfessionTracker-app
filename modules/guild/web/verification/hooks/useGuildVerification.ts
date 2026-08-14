import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  getGuildVerificationCandidates,
  getGuildVerificationStatus,
  verifyGuild
} from "../api/verificationApi";
import type {
  GuildVerificationCandidate,
  GuildVerificationStatus
} from "../types/verification.types";

export function useGuildVerification() {
  const [status, setStatus] =
    useState<GuildVerificationStatus | null>(
      null
    );

  const [
    candidates,
    setCandidates
  ] = useState<
    GuildVerificationCandidate[] | null
  >(null);

  const [
    isLoadingStatus,
    setIsLoadingStatus
  ] = useState(true);

  const [
    isLoadingCandidates,
    setIsLoadingCandidates
  ] = useState(false);

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadStatus = useCallback(
    async () => {
      setError(null);

      try {
        setStatus(
          await getGuildVerificationStatus()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Verification status could not be loaded."
        );
      }
      finally {
        setIsLoadingStatus(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const loadCandidates =
    useCallback(async () => {
      setError(null);
      setIsLoadingCandidates(true);

      try {
        const response =
          await getGuildVerificationCandidates();

        setCandidates(
          response.items
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Guilds could not be loaded from Battle.net."
        );
      }
      finally {
        setIsLoadingCandidates(false);
      }
    }, []);

  const verify = async (
    characterName: string,
    characterRealmSlug: string
  ) => {
    setError(null);
    setIsVerifying(true);

    try {
      const nextStatus =
        await verifyGuild({
          characterName,
          characterRealmSlug
        });

      setStatus(nextStatus);
    }
    catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Guild could not be verified."
      );

      throw verifyError;
    }
    finally {
      setIsVerifying(false);
    }
  };

  return {
    status,
    candidates,
    isLoadingStatus,
    isLoadingCandidates,
    isVerifying,
    error,
    loadCandidates,
    verify
  };
}
