import { Link } from "react-router-dom";
import type { GuildMember } from "../../roster/types/roster.types";
import type {
  GuildAttendanceEvent,
  GuildAttendanceStatus
} from "../types/attendance.types";

type AttendanceRecordGridProps = {
  event: GuildAttendanceEvent;
  rosterMembers: GuildMember[];
  onSetStatus: (
    memberId: string,
    status: GuildAttendanceStatus
  ) => void;
  onClearStatus: (
    memberId: string
  ) => void;
};

const statuses: GuildAttendanceStatus[] =
  [
    "PRESENT",
    "LATE",
    "EXCUSED",
    "ABSENT"
  ];

export function AttendanceRecordGrid({
  event,
  rosterMembers,
  onSetStatus,
  onClearStatus
}: AttendanceRecordGridProps) {
  const recordByMemberId =
    new Map(
      event.records.map(
        (record) => [
          record.memberId,
          record
        ]
      )
    );

  if (rosterMembers.length === 0) {
    return (
      <p className="muted-text">
        The guild roster is empty.{" "}
        <Link to="/guild/roster">
          Add guild members
        </Link>{" "}
        before tracking attendance.
      </p>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>

        <tbody>
          {rosterMembers.map(
            (member) => {
              const record =
                recordByMemberId.get(
                  member.id
                );

              return (
                <tr
                  key={member.id}
                >
                  <td>
                    {member.name}
                  </td>

                  <td>
                    <div className="attendance-status-buttons">
                      {statuses.map(
                        (
                          status
                        ) => (
                          <button
                            className={
                              record?.status ===
                              status
                                ? "attendance-status-button selected"
                                : "attendance-status-button"
                            }
                            key={
                              status
                            }
                            onClick={() =>
                              onSetStatus(
                                member.id,
                                status
                              )
                            }
                            type="button"
                          >
                            {
                              status
                            }
                          </button>
                        )
                      )}
                    </div>
                  </td>

                  <td>
                    {record && (
                      <button
                        className="text-button"
                        onClick={() =>
                          onClearStatus(
                            member.id
                          )
                        }
                        type="button"
                      >
                        Clear
                      </button>
                    )}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}
