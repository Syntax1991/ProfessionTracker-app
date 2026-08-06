import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./infrastructure/database/prismaClient.js";

const server = app.listen(
  env.PORT,
  () => {
    console.log(
      `Profession Tracker API is running on http://localhost:${env.PORT}`
    );
  }
);

async function shutdown(
  signal: string
) {
  console.log(
    `${signal} received. Shutting down.`
  );

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on(
  "SIGINT",
  () => {
    void shutdown("SIGINT");
  }
);

process.on(
  "SIGTERM",
  () => {
    void shutdown("SIGTERM");
  }
);