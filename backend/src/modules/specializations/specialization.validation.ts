import { z } from "zod";

export const characterSpecializationParamsSchema =
  z.object({
    characterId: z
      .string()
      .trim()
      .min(1)
  });

export const updateSpecializationParamsSchema =
  z.object({
    characterId: z
      .string()
      .trim()
      .min(1),

    characterProfessionId: z
      .string()
      .trim()
      .min(1)
  });

export const updateSpecializationInputSchema =
  z
    .object({
      progress: z
        .array(
          z
            .object({
              nodeId: z
                .string()
                .trim()
                .min(1),

              rank: z.coerce
                .number()
                .int()
                .min(0)
                .max(1000)
            })
            .strict()
        )
        .max(500)
        .refine(
          (entries) =>
            new Set(
              entries.map(
                (entry) =>
                  entry.nodeId
              )
            ).size === entries.length,
          "Die Spezialisierungsdaten enthalten doppelte Knoten."
        )
    })
    .strict();