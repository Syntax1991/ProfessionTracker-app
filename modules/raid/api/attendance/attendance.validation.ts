import { z } from "zod";

export const raidAttendanceStatusSchema =
  z.enum([
    "PRESENT",
    "LATE",
    "EXCUSED",
    "ABSENT"
  ]);

export const raidAttendanceRecordInputSchema =
  z
    .object({
      status:
        raidAttendanceStatusSchema
    })
    .strict();

export const raidAttendanceEventIdSchema =
  z.string().min(1);

export const raidAttendanceMemberIdSchema =
  z.string().min(1);
