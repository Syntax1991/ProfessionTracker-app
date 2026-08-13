import type { GuildAttendanceEvent } from "../types/attendance.types";

type AttendanceEventListProps = {
  events: GuildAttendanceEvent[];
  selectedEventId: string | null;
  onSelect: (
    eventId: string
  ) => void;
  onEdit: (
    event: GuildAttendanceEvent
  ) => void;
  onDelete: (
    event: GuildAttendanceEvent
  ) => void;
};

function formatDate(
  value: string
): string {
  return new Date(
    value
  ).toLocaleDateString();
}

export function AttendanceEventList({
  events,
  selectedEventId,
  onSelect,
  onEdit,
  onDelete
}: AttendanceEventListProps) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        No raid events yet.
      </div>
    );
  }

  return (
    <ul className="attendance-event-list">
      {events.map((event) => (
        <li key={event.id}>
          <button
            className={
              event.id ===
              selectedEventId
                ? "attendance-event-button selected"
                : "attendance-event-button"
            }
            onClick={() =>
              onSelect(event.id)
            }
            type="button"
          >
            <strong>
              {event.title}
            </strong>

            <span>
              {formatDate(
                event.eventDate
              )}
              {event.raidName
                ? ` · ${event.raidName}`
                : ""}
              {" · "}
              {event.records.length}{" "}
              tracked
            </span>
          </button>

          <div className="table-actions">
            <button
              className="text-button"
              onClick={() =>
                onEdit(event)
              }
              type="button"
            >
              Edit
            </button>

            <button
              className="text-button danger"
              onClick={() =>
                onDelete(event)
              }
              type="button"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
