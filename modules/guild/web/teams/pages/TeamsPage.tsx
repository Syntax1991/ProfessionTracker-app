import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
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

  const handleSubmit = async (
    input: GuildTeamInput
  ) => {
    if (editingTeam) {
      await updateTeam(
        editingTeam.id,
        input
      );

      setEditingTeam(null);
      return;
    }

    await createTeam(input);
  };

  const handleDelete = async (
    team: GuildTeam
  ) => {
    const confirmed = window.confirm(
      `${team.name} delete?`
    );

    if (!confirmed) {
      return;
    }

    await deleteTeam(team.id);

    if (
      editingTeam?.id === team.id
    ) {
      setEditingTeam(null);
    }
  };

  return (
    <>
      <PageHeader
        description="Group guild members into persistent raid or activity teams."
        eyebrow="GUILD"
        title="Teams"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <div className="guild-roster-layout">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  {editingTeam
                    ? "EDIT"
                    : "NEW TEAM"}
                </p>

                <h2>
                  {editingTeam
                    ? editingTeam.name
                    : "Create Team"}
                </h2>
              </div>
            </div>

            <TeamForm
              key={
                editingTeam?.id ??
                "new-team"
              }
              onCancel={() =>
                setEditingTeam(null)
              }
              onSubmit={
                handleSubmit
              }
              team={editingTeam}
            />
          </section>

          <div className="guild-teams-list">
            {isLoading ? (
              <LoadingPanel />
            ) : teams.length === 0 ? (
              <div className="empty-state">
                No teams yet.
              </div>
            ) : (
              teams.map((team) => (
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
                  onEdit={() =>
                    setEditingTeam(
                      team
                    )
                  }
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
              ))
            )}
          </div>
        </div>
      </GuildVerificationGate>
    </>
  );
}
