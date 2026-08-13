import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  addMythicPlusRun,
  deleteMythicPlusRun,
  getVaultMythicPlusOverview
} from "../api/vaultMythicPlusApi";
import type {
  MythicPlusRunInput,
  VaultMythicPlusResponse
} from "../types/vaultMythicPlus.types";

type VaultMythicPlusState = {
  overview: VaultMythicPlusResponse | null;
  isLoading: boolean;
  error: string | null;
  pendingAction: string | null;
  addRun: (
    characterId: string,
    input: MythicPlusRunInput
  ) => Promise<boolean>;
  deleteRun: (runId: string) => Promise<void>;
};

export function useVaultMythicPlus():
  VaultMythicPlusState {
  const [overview, setOverview] =
    useState<VaultMythicPlusResponse | null>(
      null
    );
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [pendingAction, setPendingAction] =
    useState<string | null>(null);

  const loadOverview = useCallback(
    async () => {
      setError(null);

      try {
        setOverview(
          await getVaultMythicPlusOverview()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Vault progress could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const addRun = async (
    characterId: string,
    input: MythicPlusRunInput
  ) => {
    setError(null);
    setPendingAction("add");

    try {
      setOverview(
        await addMythicPlusRun(
          characterId,
          input
        )
      );

      return true;
    }
    catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : "Mythic+ run could not be added."
      );

      return false;
    }
    finally {
      setPendingAction(null);
    }
  };

  const deleteRun = async (runId: string) => {
    setError(null);
    setPendingAction(runId);

    try {
      setOverview(
        await deleteMythicPlusRun(runId)
      );
    }
    catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Mythic+ run could not be removed."
      );
    }
    finally {
      setPendingAction(null);
    }
  };

  return {
    overview,
    isLoading,
    error,
    pendingAction,
    addRun,
    deleteRun
  };
}
