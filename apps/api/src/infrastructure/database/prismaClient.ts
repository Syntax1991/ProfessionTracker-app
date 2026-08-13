import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "../../config/env.js";
import { PrismaClient } from "../../generated/prisma/client.js";

// Prisma uses a driver adapter for direct SQLite connections.
const adapter =
  new PrismaBetterSqlite3({
    url: env.DATABASE_URL
  });

export const prisma =
  new PrismaClient({
    adapter
  });