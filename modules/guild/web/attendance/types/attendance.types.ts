export type GuildAttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "EXCUSED"
  | "LATE";

export type GuildAttendanceRecordMember = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  rank: string;
};

export type GuildAttendanceRecord = {
  id: string;
  eventId: string;
  memberId: string;
  status: GuildAttendanceStatus;
  createdAt: string;
  updatedAt: string;
  member: GuildAttendanceRecordMember;
};

export type GuildAttendanceEvent = {
  id: string;
  title: string;
  eventDate: string;
  raidName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  records: GuildAttendanceRecord[];
};

export type GuildAttendanceEventInput = {
  title: string;
  eventDate: string;
  raidName: string | null;
  notes: string | null;
};

export type GuildAttendanceEventListResponse = {
  items: GuildAttendanceEvent[];
  total: number;
};
