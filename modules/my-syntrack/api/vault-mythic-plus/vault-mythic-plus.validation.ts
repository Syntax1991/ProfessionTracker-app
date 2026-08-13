import { z } from "zod";

export const vaultCharacterIdSchema =
  z.string().min(1);

export const vaultRunIdSchema =
  z.string().min(1);

export const mythicPlusRunInputSchema =
  z
    .object({
      dungeonName: z
        .string()
        .trim()
        .max(80)
        .optional(),
      keyLevel: z.coerce
        .number()
        .int()
        .min(0)
        .max(50)
    })
    .strict();
