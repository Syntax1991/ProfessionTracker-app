export type RaidAttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "EXCUSED"
  | "ABSENT";

export type RaidAttendanceMember = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  rank: string;
};

export type RaidAttendanceRecord = {
  id: string;
  raidEventId: string;
  memberId: string;
  status: RaidAttendanceStatus;
  createdAt: string;
  updatedAt: string;
  member: RaidAttendanceMember | null;
};

export type RaidAttendanceRecordListResponse = {
  items: RaidAttendanceRecord[];
  total: number;
};

export type RaidAttendanceSummaryEvent = {
  id: string;
  title: string;
  raidInstance: string;
  difficulty: string;
  scheduledAt: string;
  teamId: string | null;
  notes: string | null;
  attendanceRecords: RaidAttendanceRecord[];
};

export type RaidAttendanceSummaryResponse = {
  items: RaidAttendanceSummaryEvent[];
  total: number;
};
