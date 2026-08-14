import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type { RaidAttendanceSummaryEvent } from "../types/attendance.types";

type AttendanceRosterTableProps = {
  events: RaidAttendanceSummaryEvent[];
  rosterMembers: GuildMember[];
};

type MemberAttendance = {
  memberId: string;
  name: string;
  presentCount: number;
  lateCount: number;
  excusedCount: number;
  absentCount: number;
  trackedCount: number;
};

function computeAttendance(
  events: RaidAttendanceSummaryEvent[],
  rosterMembers: GuildMember[]
): MemberAttendance[] {
  const byMemberId = new Map(
    rosterMembers.map((member) => [
      member.id,
      {
        memberId: member.id,
        name: member.name,
        presentCount: 0,
        lateCount: 0,
        excusedCount: 0,
        absentCount: 0,
        trackedCount: 0
      } satisfies MemberAttendance
    ])
  );

  for (const event of events) {
    for (
      const record of
      event.attendanceRecords
    ) {
      const entry =
        byMemberId.get(
          record.memberId
        );

      if (!entry) {
        continue;
      }

      if (
        record.status === "PRESENT"
      ) {
        entry.presentCount += 1;
      }
      else if (
        record.status === "LATE"
      ) {
        entry.lateCount += 1;
      }
      else if (
        record.status === "EXCUSED"
      ) {
        entry.excusedCount += 1;
      }
      else if (
        record.status === "ABSENT"
      ) {
        entry.absentCount += 1;
      }

      if (
        record.status !== "EXCUSED"
      ) {
        entry.trackedCount += 1;
      }
    }
  }

  return [...byMemberId.values()].sort(
    (left, right) => {
      const leftRate =
        left.trackedCount === 0
          ? -1
          : (left.presentCount +
              left.lateCount) /
            left.trackedCount;

      const rightRate =
        right.trackedCount === 0
          ? -1
          : (right.presentCount +
              right.lateCount) /
            right.trackedCount;

      return rightRate - leftRate;
    }
  );
}

export function AttendanceRosterTable({
  events,
  rosterMembers
}: AttendanceRosterTableProps) {
  if (rosterMembers.length === 0) {
    return (
      <p className="muted-text">
        The guild roster is empty.
      </p>
    );
  }

  const attendance =
    computeAttendance(
      events,
      rosterMembers
    );

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Present</th>
            <th>Late</th>
            <th>Excused</th>
            <th>Absent</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map(
            (entry) => (
              <tr
                key={
                  entry.memberId
                }
              >
                <td>
                  {entry.name}
                </td>

                <td>
                  {
                    entry.presentCount
                  }
                </td>

                <td>
                  {entry.lateCount}
                </td>

                <td>
                  {
                    entry.excusedCount
                  }
                </td>

                <td>
                  {
                    entry.absentCount
                  }
                </td>

                <td>
                  {entry.trackedCount ===
                  0
                    ? "—"
                    : `${Math.round(
                        ((entry.presentCount +
                          entry.lateCount) /
                          entry.trackedCount) *
                          100
                      )}%`}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
