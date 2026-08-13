import { z } from "zod";

export const battleNetImportInputSchema = z
  .object({
    characterKeys: z
      .array(
        z
          .string()
          .trim()
          .min(3)
          .max(200)
      )
      .min(
        1,
        "Mindestens ein Charakter muss ausgewählt werden."
      )
      .max(
        200,
        "Es können maximal 200 Charaktere gleichzeitig importiert werden."
      )
      .refine(
        (characterKeys) =>
          new Set(characterKeys).size ===
          characterKeys.length,
        "Die Charakterauswahl enthält doppelte Einträge."
      )
  })
  .strict();