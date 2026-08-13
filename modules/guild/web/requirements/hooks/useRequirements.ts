import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createGuildRequirement as createGuildRequirementRequest,
  deleteGuildRequirement as deleteGuildRequirementRequest,
  getGuildRequirements,
  updateGuildRequirement as updateGuildRequirementRequest
} from "../api/requirementApi";
import type {
  GuildRequirement,
  GuildRequirementInput
} from "../types/requirement.types";

export function useRequirements() {
  const [
    requirements,
    setRequirements
  ] = useState<GuildRequirement[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadRequirements =
    useCallback(async () => {
      setError(null);

      try {
        const response =
          await getGuildRequirements();

        setRequirements(
          response.items
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Requirements could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadRequirements();
  }, [loadRequirements]);

  const createRequirement = async (
    input: GuildRequirementInput
  ) => {
    setError(null);

    try {
      await createGuildRequirementRequest(
        input
      );

      await loadRequirements();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Requirement could not be created.";

      setError(message);
      throw createError;
    }
  };

  const updateRequirement = async (
    requirementId: string,
    input: GuildRequirementInput
  ) => {
    setError(null);

    try {
      await updateGuildRequirementRequest(
        requirementId,
        input
      );

      await loadRequirements();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Requirement could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const deleteRequirement = async (
    requirementId: string
  ) => {
    setError(null);

    try {
      await deleteGuildRequirementRequest(
        requirementId
      );

      await loadRequirements();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Requirement could not be deleted.";

      setError(message);
      throw deleteError;
    }
  };

  return {
    requirements,
    isLoading,
    error,
    createRequirement,
    updateRequirement,
    deleteRequirement
  };
}
