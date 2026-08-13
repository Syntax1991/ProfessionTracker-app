import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createGuildMember as createGuildMemberRequest,
  deleteGuildMember as deleteGuildMemberRequest,
  getGuildRoster,
  updateGuildMember as updateGuildMemberRequest
} from "../api/rosterApi";
import type {
  GuildMember,
  GuildMemberInput
} from "../types/roster.types";

type GuildRosterActions = {
  members: GuildMember[];
  isLoading: boolean;
  error: string | null;
  createMember: (
    input: GuildMemberInput
  ) => Promise<void>;
  updateMember: (
    memberId: string,
    input: GuildMemberInput
  ) => Promise<void>;
  deleteMember: (
    memberId: string
  ) => Promise<void>;
  reload: () => Promise<void>;
};

export function useRoster(): GuildRosterActions {
  const [members, setMembers] =
    useState<GuildMember[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const loadMembers = useCallback(
    async () => {
      setError(null);

      try {
        const response = await getGuildRoster();
        setMembers(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Guild roster could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const createMember = async (
    input: GuildMemberInput
  ) => {
    setError(null);

    try {
      await createGuildMemberRequest(input);
      await loadMembers();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Guild member could not be created.";

      setError(message);
      throw createError;
    }
  };

  const updateMember = async (
    memberId: string,
    input: GuildMemberInput
  ) => {
    setError(null);

    try {
      await updateGuildMemberRequest(
        memberId,
        input
      );

      await loadMembers();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Guild member could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const deleteMember = async (
    memberId: string
  ) => {
    setError(null);

    try {
      await deleteGuildMemberRequest(memberId);
      await loadMembers();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Guild member could not be deleted.";

      setError(message);
      throw deleteError;
    }
  };

  return {
    members,
    isLoading,
    error,
    createMember,
    updateMember,
    deleteMember,
    reload: loadMembers
  };
}
