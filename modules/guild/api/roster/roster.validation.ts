import { z } from "zod";

export const guildMemberInputSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(30),

      realm: z
        .string()
        .trim()
        .min(2)
        .max(50),

      region: z.enum([
        "eu",
        "us",
        "kr",
        "tw"
      ]),

      className: z
        .string()
        .trim()
        .min(2)
        .max(40),

      level: z.coerce
        .number()
        .int()
        .min(1)
        .max(100),

      rank: z
        .string()
        .trim()
        .min(1)
        .max(50),

      rankIndex: z.coerce
        .number()
        .int()
        .min(0)
        .max(20)
        .default(0),

      note: z
        .string()
        .trim()
        .max(255)
        .nullable()
        .default(null),

      officerNote: z
        .string()
        .trim()
        .max(255)
        .nullable()
        .default(null)
    })
    .strict();

export const guildMemberIdSchema =
  z.string().min(1);
