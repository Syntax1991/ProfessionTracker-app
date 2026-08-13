import { z } from "zod";
import {
  enchantStatuses,
  gearSlotKeys
} from "./gear-readiness.types.js";

export const gearCharacterIdSchema =
  z.string().min(1);

export const gearSlotKeySchema =
  z.enum(gearSlotKeys);

export const gearSlotInputSchema =
  z
    .object({
      itemName: z
        .string()
        .trim()
        .min(1)
        .max(120),
      itemLevel: z.coerce
        .number()
        .int()
        .min(1)
        .max(1500)
        .optional(),
      enchantStatus: z.enum(
        enchantStatuses
      ),
      enchantName: z
        .string()
        .trim()
        .max(120)
        .optional(),
      socketCount: z.coerce
        .number()
        .int()
        .min(0)
        .max(6),
      gemCount: z.coerce
        .number()
        .int()
        .min(0)
        .max(6),
      notes: z
        .string()
        .trim()
        .max(300)
        .optional()
    })
    .strict();
