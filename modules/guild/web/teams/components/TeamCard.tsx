import { Link } from "react-router-dom";
import type {
  GuildTeam,
  GuildTeamMemberSummary
} from "../types/team.types";
import { TeamMemberPicker } from "./TeamMemberPicker";

type TeamCardProps = {
  team: GuildTeam;
  rosterMembers: GuildTeamMemberSummary[];
  onEdit: () => void;
  onDelete: () => void;
  onAddMember: (
    memberId: string,
    role: string
  ) => void;
  onRemoveMember: (
    memberId: string
  ) => void;
};

export function TeamCard({
  team,
  rosterMembers,
  onEdit,
  onDelete,
  onAddMember,
  onRemoveMember
}: TeamCardProps) {
  const assignedMemberIds =
    new Set(
      team.members.map(
        (membership) =>
          membership.member.id
      )
    );

  const availableMembers =
    rosterMembers.filter(
      (member) =>
        !assignedMemberIds.has(
          member.id
        )
    );

  return (
    <article className="panel team-card">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            {team.color && (
              <span
                className="team-color-dot"
                style={{
                  background:
                    team.color
                }}
              />
            )}
            TEAM
          </p>

          <h2>{team.name}</h2>

          {team.description && (
            <span>
              {team.description}
            </span>
          )}
        </div>

        <div className="table-actions">
          <button
            className="text-button"
            onClick={onEdit}
            type="button"
          >
            Edit
          </button>

          <button
            className="text-button danger"
            onClick={onDelete}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      {team.members.length === 0 ? (
        <p className="muted-text">
          No members assigned yet.
        </p>
      ) : (
        <ul className="team-member-list">
          {team.members.map(
            (membership) => (
              <li
                key={membership.id}
              >
                <span>
                  {
                    membership
                      .member.name
                  }
                </span>

                <span className="rank-badge">
                  {membership.role}
                </span>

                <button
                  className="text-button danger"
                  onClick={() =>
                    onRemoveMember(
                      membership
                        .member.id
                    )
                  }
                  type="button"
                >
                  Remove
                </button>
              </li>
            )
          )}
        </ul>
      )}

      {rosterMembers.length === 0 ? (
        <p className="muted-text">
          The guild roster is empty.{" "}
          <Link to="/guild/roster">
            Add guild members
          </Link>{" "}
          before assigning them to a team.
        </p>
      ) : (
        <TeamMemberPicker
          availableMembers={
            availableMembers
          }
          onAdd={onAddMember}
        />
      )}
    </article>
  );
}
