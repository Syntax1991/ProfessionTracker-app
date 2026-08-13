import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  addGuildTeamMember as addGuildTeamMemberRequest,
  createGuildTeam as createGuildTeamRequest,
  deleteGuildTeam as deleteGuildTeamRequest,
  getGuildTeams,
  removeGuildTeamMember as removeGuildTeamMemberRequest,
  updateGuildTeam as updateGuildTeamRequest
} from "../api/teamApi";
import type {
  GuildTeam,
  GuildTeamInput,
  GuildTeamMemberInput
} from "../types/team.types";

export function useTeams() {
  const [teams, setTeams] =
    useState<GuildTeam[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadTeams = useCallback(
    async () => {
      setError(null);

      try {
        const response =
          await getGuildTeams();

        setTeams(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Teams could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadTeams();
  }, [loadTeams]);

  const createTeam = async (
    input: GuildTeamInput
  ) => {
    setError(null);

    try {
      await createGuildTeamRequest(
        input
      );

      await loadTeams();
    }
    catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Team could not be created.";

      setError(message);
      throw createError;
    }
  };

  const updateTeam = async (
    teamId: string,
    input: GuildTeamInput
  ) => {
    setError(null);

    try {
      await updateGuildTeamRequest(
        teamId,
        input
      );

      await loadTeams();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Team could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const deleteTeam = async (
    teamId: string
  ) => {
    setError(null);

    try {
      await deleteGuildTeamRequest(
        teamId
      );

      await loadTeams();
    }
    catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Team could not be deleted.";

      setError(message);
      throw deleteError;
    }
  };

  const addMember = async (
    teamId: string,
    input: GuildTeamMemberInput
  ) => {
    setError(null);

    try {
      await addGuildTeamMemberRequest(
        teamId,
        input
      );

      await loadTeams();
    }
    catch (addError) {
      const message =
        addError instanceof Error
          ? addError.message
          : "Member could not be added.";

      setError(message);
      throw addError;
    }
  };

  const removeMember = async (
    teamId: string,
    memberId: string
  ) => {
    setError(null);

    try {
      await removeGuildTeamMemberRequest(
        teamId,
        memberId
      );

      await loadTeams();
    }
    catch (removeError) {
      const message =
        removeError instanceof Error
          ? removeError.message
          : "Member could not be removed.";

      setError(message);
      throw removeError;
    }
  };

  return {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember
  };
}
