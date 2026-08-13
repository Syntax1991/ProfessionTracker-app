import { z } from "zod";

export const weeklyChecklistCharacterIdSchema =
  z.string().min(1);

export const weeklyChecklistTaskKeySchema =
  z
    .string()
    .trim()
    .min(1)
    .max(60);

export const weeklyTaskUpdateSchema =
  z
    .object({
      completed: z.boolean()
    })
    .strict();
