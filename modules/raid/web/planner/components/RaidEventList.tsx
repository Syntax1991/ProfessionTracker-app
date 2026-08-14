import type { RaidEvent } from "../types/raidEvent.types";

type RaidEventListProps = {
  events: RaidEvent[];
  onSelect: (
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
  onSelect
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
          </tr>
        </thead>

        <tbody>
          {events.map(
            (event) => (
              <tr
                className="clickable-row"
                key={event.id}
                onClick={() =>
                  onSelect(event)
                }
              >
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
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
