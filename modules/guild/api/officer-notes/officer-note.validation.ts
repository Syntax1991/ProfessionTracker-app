import { z } from "zod";

export const guildOfficerNoteInputSchema =
  z
    .object({
      memberId: z.string().min(1),

      body: z
        .string()
        .trim()
        .min(1)
        .max(1000)
    })
    .strict();

export const guildOfficerNoteIdSchema =
  z.string().min(1);

export const guildMemberIdParamSchema =
  z.string().min(1);
