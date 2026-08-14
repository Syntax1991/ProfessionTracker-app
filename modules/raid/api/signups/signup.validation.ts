import { z } from "zod";

export const raidSignupStatusSchema =
  z.enum([
    "PRESENT",
    "TENTATIVE",
    "ABSENT"
  ]);

export const raidSignupInputSchema =
  z
    .object({
      status:
        raidSignupStatusSchema
    })
    .strict();

export const raidEventIdParamSchema =
  z.string().min(1);

export const raidSignupMemberIdSchema =
  z.string().min(1);
