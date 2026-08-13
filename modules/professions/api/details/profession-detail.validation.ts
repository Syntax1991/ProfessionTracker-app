import { z } from "zod";

export const professionDetailParamsSchema =
  z.object({
    professionId: z
      .string()
      .trim()
      .min(1)
  });