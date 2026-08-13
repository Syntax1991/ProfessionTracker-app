import { z } from "zod";

export const raidDifficultySchema =
  z.enum([
    "LFR",
    "NORMAL",
    "HEROIC",
    "MYTHIC"
  ]);

export const raidEventInputSchema =
  z
    .object({
      title: z
        .string()
        .trim()
        .min(2)
        .max(120),

      raidInstance: z
        .string()
        .trim()
        .min(2)
        .max(120),

      difficulty:
        raidDifficultySchema.default(
          "HEROIC"
        ),

      scheduledAt: z
        .string()
        .trim()
        .min(1),

      teamId: z
        .string()
        .min(1)
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

export const raidEventIdSchema =
  z.string().min(1);
