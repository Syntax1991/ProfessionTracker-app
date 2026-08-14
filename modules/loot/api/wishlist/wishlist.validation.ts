import { z } from "zod";

export const lootTierSlotParamSchema =
  z.enum([
    "HEAD",
    "SHOULDER",
    "CHEST",
    "GLOVES",
    "LEGS"
  ]);

export const lootTierStatusInputSchema =
  z
    .object({
      status: z.enum([
        "PREFERRED",
        "AVOID"
      ])
    })
    .strict();

export const lootTrinketRankParamSchema =
  z.coerce
    .number()
    .int()
    .min(1)
    .max(3);

export const lootTrinketChoiceInputSchema =
  z
    .object({
      itemId: z.coerce
        .number()
        .int()
        .positive()
    })
    .strict();
