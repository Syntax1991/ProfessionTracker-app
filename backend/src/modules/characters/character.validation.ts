import { z } from "zod";

export const characterInputSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(30),

      realm: z
        .string()
        .trim()
        .min(2)
        .max(50),

      region: z.enum([
        "eu",
        "us",
        "kr",
        "tw"
      ]),

      className: z
        .string()
        .trim()
        .min(2)
        .max(40),

      level: z.coerce
        .number()
        .int()
        .min(1)
        .max(100),

      professionIds: z
        .array(
          z.string().min(1)
        )
        .max(2)
        .default([])
    })
    .strict();

export const characterIdSchema =
  z.string().min(1);