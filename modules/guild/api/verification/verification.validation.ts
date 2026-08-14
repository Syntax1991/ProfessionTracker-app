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

export const guildVerificationLookupInputSchema =
  z
    .object({
      realmName: z
        .string()
        .trim()
        .min(2)
        .max(50),

      guildName: z
        .string()
        .trim()
        .min(2)
        .max(50)
    })
    .strict();
