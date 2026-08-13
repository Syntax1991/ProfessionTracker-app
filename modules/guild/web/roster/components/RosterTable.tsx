import type { GuildMember } from "../types/roster.types";

type RosterTableProps = {
  members: GuildMember[];
  onDelete: (
    member: GuildMember
  ) => void;
  onEdit: (
    member: GuildMember
  ) => void;
};

export function RosterTable({
  members,
  onDelete,
  onEdit
}: RosterTableProps) {
  if (members.length === 0) {
    return (
      <div className="empty-state">
        No guild members yet.
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Level</th>
            <th>Rank</th>
            <th>Item Level</th>
            <th>Note</th>
            <th>Source</th>
            <th aria-label="Actions" />
          </tr>
        </thead>

        <tbody>
          {members.map(
            (member) => (
              <tr key={member.id}>
                <td>
                  <div className="character-identity">
                    <div className="character-avatar">
                      {member.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {member.name}
                      </strong>

                      <span>
                        {member.className}
                        {" · "}
                        {member.realm}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  {member.level}
                </td>

                <td>
                  <span className="rank-badge">
                    {member.rank}
                  </span>
                </td>

                <td>
                  {member.averageItemLevel !==
                  null ? (
                    Math.round(
                      member.averageItemLevel
                    )
                  ) : (
                    <span className="muted-text">
                      —
                    </span>
                  )}
                </td>

                <td>
                  {member.note ? (
                    <span className="guild-note">
                      {member.note}
                    </span>
                  ) : (
                    <span className="muted-text">
                      —
                    </span>
                  )}
                </td>

                <td>
                  <span
                    className={
                      member.source ===
                      "ADDON"
                        ? "source-badge addon"
                        : "source-badge manual"
                    }
                  >
                    {member.source}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="text-button"
                      onClick={() =>
                        onEdit(
                          member
                        )
                      }
                      type="button"
                    >
                      Edit
                    </button>

                    <button
                      className="text-button danger"
                      onClick={() =>
                        onDelete(
                          member
                        )
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
