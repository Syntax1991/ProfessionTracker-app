import type { GuildAttendanceEvent } from "../types/attendance.types";

type AttendanceSummaryProps = {
  events: GuildAttendanceEvent[];
};

type MemberSummary = {
  memberId: string;
  name: string;
  presentCount: number;
  trackedCount: number;
};

/**
 * Excused absences count toward neither attended nor missed events, so
 * they don't drag a member's percentage down for a sanctioned absence.
 */
function computeSummary(
  events: GuildAttendanceEvent[]
): MemberSummary[] {
  const summaryByMemberId =
    new Map<
      string,
      MemberSummary
    >();

  for (
    const event of events
  ) {
    for (
      const record of
      event.records
    ) {
      if (
        record.status ===
        "EXCUSED"
      ) {
        continue;
      }

      const existing =
        summaryByMemberId.get(
          record.memberId
        ) ?? {
          memberId:
            record.memberId,
          name: record.member
            .name,
          presentCount: 0,
          trackedCount: 0
        };

      existing.trackedCount += 1;

      if (
        record.status ===
          "PRESENT" ||
        record.status === "LATE"
      ) {
        existing.presentCount +=
          1;
      }

      summaryByMemberId.set(
        record.memberId,
        existing
      );
    }
  }

  return [
    ...summaryByMemberId.values()
  ].sort(
    (left, right) =>
      right.presentCount /
        right.trackedCount -
      left.presentCount /
        left.trackedCount
  );
}

export function AttendanceSummary({
  events
}: AttendanceSummaryProps) {
  const summary =
    computeSummary(events);

  if (summary.length === 0) {
    return (
      <p className="muted-text">
        No attendance recorded yet.
      </p>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {summary.map(
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
                  {Math.round(
                    (entry.presentCount /
                      entry.trackedCount) *
                      100
                  )}
                  %
                  <span className="muted-text">
                    {" "}
                    (
                    {
                      entry.presentCount
                    }
                    /
                    {
                      entry.trackedCount
                    }
                    )
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
