import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";
import {
  assertRankBounds,
  createCoverageSummary,
  fetchJson,
  findAddonCoverage,
  verifyFrontendWiring
} from "./validation/addon-web-flow.helpers.mjs";

const currentFile =
  fileURLToPath(
    import.meta.url
  );

const projectRoot =
  path.resolve(
    path.dirname(
      currentFile
    ),
    ".."
  );

const backendRoot =
  path.join(
    projectRoot,
    "backend"
  );

const specializationApiPath =
  path.join(
    projectRoot,
    "frontend",
    "src",
    "features",
    "specializations",
    "api",
    "specializationApi.ts"
  );

const appRouterPath =
  path.join(
    projectRoot,
    "frontend",
    "src",
    "app",
    "AppRouter.tsx"
  );

verifyFrontendWiring(
  specializationApiPath,
  appRouterPath
);

process.chdir(
  backendRoot
);

const appUrl =
  pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      "app.js"
    )
  ).href;

const prismaUrl =
  pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      "infrastructure",
      "database",
      "prismaClient.js"
    )
  ).href;

const {
  app
} =
  await import(
    appUrl
  );

const {
  prisma
} =
  await import(
    prismaUrl
  );

const server =
  app.listen(
    0,
    "127.0.0.1"
  );

await new Promise(
  (
    resolve,
    reject
  ) => {
    server.once(
      "listening",
      resolve
    );

    server.once(
      "error",
      reject
    );
  }
);

const address =
  server.address();

if (
  !address ||
  typeof address === "string"
) {
  throw new Error(
    "Temporary API port could not be resolved."
  );
}

const baseUrl =
  `http://127.0.0.1:${address.port}/api`;

try {
  console.log(
    `Temporary API: ${baseUrl}`
  );

  const health =
    await fetchJson(
      `${baseUrl}/health`
    );

  if (!health.ok) {
    throw new Error(
      "API health check failed."
    );
  }

  const characterResponse =
    await fetchJson(
      `${baseUrl}/characters`
    );

  const characters =
    Array.isArray(
      characterResponse
    )
      ? characterResponse
      : characterResponse?.items;

  if (
    !Array.isArray(
      characters
    ) ||
    characters.length === 0
  ) {
    throw new Error(
      "Character API returned no character items."
    );
  }

  console.log(
    `Character API: ${characters.length} characters`
  );

  const result =
    await findAddonCoverage(
      baseUrl,
      characters
    );

  if (!result) {
    throw new Error(
      "No imported ADDON specialization progress was exposed by the API."
    );
  }

  assertRankBounds(
    result.matches
  );

  const summary =
    createCoverageSummary(
      result
    );

  console.log("");
  console.log(
    "Validated web-flow data:"
  );

  console.log(
    JSON.stringify(
      summary,
      null,
      2
    )
  );

  console.log("");
  console.log(
    "Character API envelope: PASSED"
  );

  console.log(
    "Character API items: PASSED"
  );

  console.log(
    "Specialization API: PASSED"
  );

  console.log(
    "ADDON progress: PASSED"
  );

  console.log(
    "Rank/maxRank consistency: PASSED"
  );

  console.log(
    "Frontend API wiring: PASSED"
  );

  console.log(
    "Frontend route wiring: PASSED"
  );
}
finally {
  await new Promise(
    (
      resolve,
      reject
    ) => {
      server.close(
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        }
      );
    }
  );

  await prisma.$disconnect();
}