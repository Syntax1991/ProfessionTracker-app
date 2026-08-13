import type { GuildMember } from "../../roster/types/roster.types";
import type { GuildRequirement } from "../types/requirement.types";

type RequirementListProps = {
  requirements: GuildRequirement[];
  rosterMembers: GuildMember[];
  onDelete: (
    requirement: GuildRequirement
  ) => void;
  onEdit: (
    requirement: GuildRequirement
  ) => void;
};

function renderCompliance(
  requirement: GuildRequirement,
  rosterMembers: GuildMember[]
) {
  if (
    requirement.category !==
      "GEAR" ||
    !requirement.minimumItemLevel
  ) {
    return (
      <span className="muted-text">
        —
      </span>
    );
  }

  const auditedMembers =
    rosterMembers.filter(
      (member) =>
        typeof member.averageItemLevel ===
        "number"
    );

  if (auditedMembers.length === 0) {
    return (
      <span className="muted-text">
        No audit data yet
      </span>
    );
  }

  const belowThreshold =
    auditedMembers.filter(
      (member) =>
        (member.averageItemLevel ??
          0) <
        requirement.minimumItemLevel!
    );

  const meetingCount =
    auditedMembers.length -
    belowThreshold.length;

  return (
    <div>
      <span
        className={
          belowThreshold.length ===
          0
            ? "source-badge addon"
            : "source-badge manual"
        }
      >
        {meetingCount}/
        {auditedMembers.length}{" "}
        meet{" "}
        {
          requirement.minimumItemLevel
        }
        +
      </span>

      {belowThreshold.length >
        0 && (
        <div className="guild-note">
          Below:{" "}
          {belowThreshold
            .map(
              (member) =>
                member.name
            )
            .join(", ")}
        </div>
      )}
    </div>
  );
}

export function RequirementList({
  requirements,
  rosterMembers,
  onDelete,
  onEdit
}: RequirementListProps) {
  if (requirements.length === 0) {
    return (
      <div className="empty-state">
        No requirements defined yet.
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Requirement</th>
            <th>Category</th>
            <th>Compliance</th>
            <th aria-label="Actions" />
          </tr>
        </thead>

        <tbody>
          {requirements.map(
            (requirement) => (
              <tr key={requirement.id}>
                <td>
                  <strong>
                    {requirement.title}
                  </strong>

                  {requirement.description && (
                    <div className="guild-note">
                      {
                        requirement.description
                      }
                    </div>
                  )}
                </td>

                <td>
                  <span className="rank-badge">
                    {requirement.category}
                  </span>
                </td>

                <td>
                  {renderCompliance(
                    requirement,
                    rosterMembers
                  )}
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="text-button"
                      onClick={() =>
                        onEdit(
                          requirement
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
                          requirement
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
