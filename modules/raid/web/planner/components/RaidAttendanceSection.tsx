import { AttendanceRecordGrid } from "../../attendance/components/AttendanceRecordGrid";
import type {
  RaidAttendanceRecord,
  RaidAttendanceStatus
} from "../../attendance/types/attendance.types";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";

type RaidAttendanceSectionProps = {
  records: RaidAttendanceRecord[];
  rosterMembers: GuildMember[];
  onSetStatus: (
    memberId: string,
    status: RaidAttendanceStatus
  ) => void;
  onClearStatus: (
    memberId: string
  ) => void;
};

export function RaidAttendanceSection({
  records,
  rosterMembers,
  onSetStatus,
  onClearStatus
}: RaidAttendanceSectionProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            ATTENDANCE
          </p>

          <h2>
            Record who showed up
          </h2>
        </div>
      </div>

      <AttendanceRecordGrid
        onClearStatus={
          onClearStatus
        }
        onSetStatus={onSetStatus}
        records={records}
        rosterMembers={
          rosterMembers
        }
      />
    </section>
  );
}
