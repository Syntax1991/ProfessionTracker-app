import { z } from "zod";

export const droptimizerReportInputSchema =
  z
    .object({
      reportUrl: z
        .string()
        .trim()
        .min(1)
    })
    .strict();
