import { z } from "zod";

export const guildTeamInputSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(60),

      description: z
        .string()
        .trim()
        .max(255)
        .nullable()
        .default(null),

      color: z
        .string()
        .trim()
        .max(20)
        .nullable()
        .default(null),

      sortOrder: z.coerce
        .number()
        .int()
        .min(0)
        .max(999)
        .default(0)
    })
    .strict();

export const guildTeamIdSchema =
  z.string().min(1);

export const guildTeamMemberInputSchema =
  z
    .object({
      memberId: z.string().min(1),

      role: z
        .enum([
          "MEMBER",
          "SUBSTITUTE",
          "LEAD"
        ])
        .default("MEMBER")
    })
    .strict();
