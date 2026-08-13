import { z } from "zod";
import {
  raidTaskCategories,
  raidTaskPriorities
} from "./raid-task.types.js";

export const raidTaskCharacterIdSchema =
  z.string().min(1);

export const raidTaskIdSchema =
  z.string().min(1);

export const personalRaidTaskInputSchema =
  z
    .object({
      title: z
        .string()
        .trim()
        .min(1)
        .max(100),
      description: z
        .string()
        .trim()
        .max(300)
        .optional(),
      category: z.enum(
        raidTaskCategories
      ),
      priority: z.enum(
        raidTaskPriorities
      ),
      raidName: z
        .string()
        .trim()
        .max(80)
        .optional(),
      dueAt: z
        .iso
        .datetime({
          offset: true
        })
        .optional()
    })
    .strict();

export const raidTaskCompletionInputSchema =
  z
    .object({
      completed: z.boolean()
    })
    .strict();
