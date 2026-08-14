import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  getGuildVerificationCandidates,
  getGuildVerificationStatus,
  lookupGuild,
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

  const [
    isLookingUpGuild,
    setIsLookingUpGuild
  ] = useState(false);

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

  const lookup = async (
    realmName: string,
    guildName: string
  ) => {
    setError(null);
    setIsLookingUpGuild(true);

    try {
      const candidate =
        await lookupGuild({
          realmName,
          guildName
        });

      setCandidates([candidate]);
    }
    catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "Guild could not be found."
      );
    }
    finally {
      setIsLookingUpGuild(false);
    }
  };

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
    isLookingUpGuild,
    error,
    loadCandidates,
    lookup,
    verify
  };
}
