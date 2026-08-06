import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(4000),

  FRONTEND_ORIGIN: z
    .string()
    .default(
      "http://localhost:5173"
    ),

  DATABASE_URL: z
    .string()
    .default(
      "file:./prisma/dev.db"
    ),

  CRAFTING_MIN_LEVEL: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(80),

  BATTLENET_REGION: z
    .string()
    .default("eu"),

  BATTLENET_CLIENT_ID: z
    .string()
    .default(""),

  BATTLENET_CLIENT_SECRET: z
    .string()
    .default(""),

  BATTLENET_REDIRECT_URI: z
    .string()
    .url()
    .default(
      "http://localhost:4000/api/auth/battlenet/callback"
    )
});

const parsedEnvironment =
  environmentSchema.safeParse(
    process.env
  );

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid environment configuration: ${parsedEnvironment.error.message}`
  );
}

export const env =
  parsedEnvironment.data;