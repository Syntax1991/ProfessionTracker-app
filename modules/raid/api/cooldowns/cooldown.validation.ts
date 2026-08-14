import { z } from "zod";

export const raidCooldownAssignmentInputSchema =
  z
    .object({
      memberId: z
        .string()
        .min(1),

      abilityName: z
        .string()
        .trim()
        .min(1)
        .max(80),

      phaseLabel: z
        .string()
        .trim()
        .max(60)
        .nullable()
        .optional(),

      sortOrder: z.coerce
        .number()
        .int()
        .min(0)
        .max(999)
        .default(0)
    })
    .strict();

export const raidCooldownEventIdParamSchema =
  z.string().min(1);

export const raidCooldownBossIdSchema =
  z.string().min(1);

export const raidCooldownAssignmentIdSchema =
  z.string().min(1);
