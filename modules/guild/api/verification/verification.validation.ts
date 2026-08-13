import { z } from "zod";

export const guildVerificationInputSchema =
  z
    .object({
      characterName: z
        .string()
        .trim()
        .min(2)
        .max(30),

      characterRealmSlug: z
        .string()
        .trim()
        .min(1)
        .max(60)
    })
    .strict();
