import type { GuildRequirement } from "../types/requirement.types";

type RequirementListProps = {
  requirements: GuildRequirement[];
  onDelete: (
    requirement: GuildRequirement
  ) => void;
  onEdit: (
    requirement: GuildRequirement
  ) => void;
};

export function RequirementList({
  requirements,
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
