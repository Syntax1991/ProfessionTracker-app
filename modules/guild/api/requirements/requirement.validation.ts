import { z } from "zod";

export const guildRequirementCategorySchema =
  z.enum([
    "GEAR",
    "KEYSTONE",
    "ATTENDANCE",
    "PROFESSION",
    "OTHER"
  ]);

export const guildRequirementInputSchema =
  z
    .object({
      title: z
        .string()
        .trim()
        .min(2)
        .max(120),

      description: z
        .string()
        .trim()
        .max(500)
        .nullable()
        .default(null),

      category:
        guildRequirementCategorySchema.default(
          "OTHER"
        ),

      minimumItemLevel: z.coerce
        .number()
        .int()
        .min(1)
        .max(999)
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

export const guildRequirementIdSchema =
  z.string().min(1);
