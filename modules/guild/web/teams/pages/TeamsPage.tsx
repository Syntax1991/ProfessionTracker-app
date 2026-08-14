import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { GuildEditorModal } from "../../shared/components/GuildEditorModal";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { TeamCard } from "../components/TeamCard";
import { TeamForm } from "../components/TeamForm";
import { useTeams } from "../hooks/useTeams";
import type {
  GuildTeam,
  GuildTeamInput
} from "../types/team.types";

export function TeamsPage() {
  const [
    editingTeam,
    setEditingTeam
  ] = useState<GuildTeam | null>(
    null
  );

  const [
    isEditorOpen,
    setIsEditorOpen
  ] = useState(false);

  const {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember
  } = useTeams();

  const {
    members: rosterMembers
  } = useRoster();

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingTeam(null);
  };

  const openCreateEditor = () => {
    setEditingTeam(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (
    team: GuildTeam
  ) => {
    setEditingTeam(team);
    setIsEditorOpen(true);
  };

  const handleSubmit = async (
    input: GuildTeamInput
  ) => {
    if (editingTeam) {
      await updateTeam(
        editingTeam.id,
        input
      );
    }
    else {
      await createTeam(input);
    }

    closeEditor();
  };

  const handleDelete = async (
    team: GuildTeam
  ) => {
    if (
      !window.confirm(
        `${team.name} delete?`
      )
    ) {
      return;
    }

    await deleteTeam(team.id);

    if (
      editingTeam?.id ===
      team.id
    ) {
      closeEditor();
    }
  };

  return (
    <div className="guild-page">
      <PageHeader
        description="Organize the roster into persistent raid or activity teams."
        eyebrow="GUILD"
        title="Teams"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <div className="guild-section-toolbar">
          <div>
            <span className="eyebrow">
              TEAMS
            </span>

            <h2>
              {teams.length}{" "}
              {teams.length === 1
                ? "Team"
                : "Teams"}
            </h2>
          </div>

          <button
            className="button button-primary"
            onClick={openCreateEditor}
            type="button"
          >
            + Create Team
          </button>
        </div>

        {isLoading ? (
          <LoadingPanel />
        ) : teams.length === 0 ? (
          <section className="panel guild-empty-panel">
            <div className="empty-state">
              No teams yet.
            </div>
          </section>
        ) : (
          <div className="guild-teams-list">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                onAddMember={(
                  memberId,
                  role
                ) => {
                  void addMember(
                    team.id,
                    {
                      memberId,
                      role
                    }
                  );
                }}
                onDelete={() => {
                  void handleDelete(
                    team
                  );
                }}
                onEdit={() => {
                  openEditEditor(team);
                }}
                onRemoveMember={(
                  memberId
                ) => {
                  void removeMember(
                    team.id,
                    memberId
                  );
                }}
                rosterMembers={
                  rosterMembers
                }
                team={team}
              />
            ))}
          </div>
        )}

        <GuildEditorModal
          description="Configure the team identity and ordering."
          eyebrow={
            editingTeam
              ? "EDIT TEAM"
              : "NEW TEAM"
          }
          isOpen={isEditorOpen}
          onClose={closeEditor}
          title={
            editingTeam
              ? editingTeam.name
              : "Create Team"
          }
        >
          <TeamForm
            key={
              editingTeam?.id ??
              "new-team"
            }
            onCancel={closeEditor}
            onSubmit={handleSubmit}
            team={editingTeam}
          />
        </GuildEditorModal>
      </GuildVerificationGate>
    </div>
  );
}