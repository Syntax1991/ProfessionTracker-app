import type { RaidEvent } from "../types/raidEvent.types";

type RaidEventListProps = {
  events: RaidEvent[];
  onDelete: (
    event: RaidEvent
  ) => void;
  onEdit: (
    event: RaidEvent
  ) => void;
};

function formatSchedule(
  value: string
): string {
  return new Date(
    value
  ).toLocaleString();
}

export function RaidEventList({
  events,
  onDelete,
  onEdit
}: RaidEventListProps) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        No raids scheduled yet.
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Raid</th>
            <th>Difficulty</th>
            <th>Scheduled</th>
            <th>Team</th>
            <th aria-label="Actions" />
          </tr>
        </thead>

        <tbody>
          {events.map(
            (event) => (
              <tr key={event.id}>
                <td>
                  <strong>
                    {event.title}
                  </strong>

                  <div className="guild-note">
                    {
                      event.raidInstance
                    }
                  </div>
                </td>

                <td>
                  <span className="rank-badge">
                    {
                      event.difficulty
                    }
                  </span>
                </td>

                <td>
                  {formatSchedule(
                    event.scheduledAt
                  )}
                </td>

                <td>
                  {event.teamName ?? (
                    <span className="muted-text">
                      —
                    </span>
                  )}
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="text-button"
                      onClick={() =>
                        onEdit(
                          event
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
                          event
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
