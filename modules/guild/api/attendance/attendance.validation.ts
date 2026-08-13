import { z } from "zod";

export const guildAttendanceStatusSchema =
  z.enum([
    "PRESENT",
    "ABSENT",
    "EXCUSED",
    "LATE"
  ]);

export const guildAttendanceEventInputSchema =
  z
    .object({
      title: z
        .string()
        .trim()
        .min(2)
        .max(120),

      eventDate: z
        .string()
        .trim()
        .min(1),

      raidName: z
        .string()
        .trim()
        .max(120)
        .nullable()
        .default(null),

      notes: z
        .string()
        .trim()
        .max(500)
        .nullable()
        .default(null)
    })
    .strict();

export const guildAttendanceRecordInputSchema =
  z
    .object({
      status:
        guildAttendanceStatusSchema
    })
    .strict();

export const guildAttendanceEventIdSchema =
  z.string().min(1);

export const guildAttendanceMemberIdSchema =
  z.string().min(1);
