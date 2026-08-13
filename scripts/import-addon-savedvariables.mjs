import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";

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
    "apps/api"
  );

const savedVariablesPath =
  process.argv[2];

if (!savedVariablesPath) {
  throw new Error(
    "SavedVariables path is required."
  );
}

if (
  !fs.existsSync(
    savedVariablesPath
  )
) {
  throw new Error(
    `SavedVariables file does not exist: ${savedVariablesPath}`
  );
}

const prismaDirectory =
  path.join(
    backendRoot,
    "prisma"
  );

if (
  !fs.existsSync(
    prismaDirectory
  )
) {
  throw new Error(
    `Prisma directory does not exist: ${prismaDirectory}`
  );
}

/*
 * DATABASE_URL defaults to file:./prisma/dev.db.
 * The API normally starts with apps/api as cwd.
 * Match that environment before importing Prisma.
 */
process.chdir(
  backendRoot
);

const prismaClientUrl =
  pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      "apps",
      "api",
      "src",
      "infrastructure",
      "database",
      "prismaClient.js"
    )
  ).href;

const persistenceUrl =
  pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      "modules",
      "data-platform",
      "api",
      "integrations",
      "addon",
      "addon-import.persistence.js"
    )
  ).href;

const serviceUrl =
  pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      "modules",
      "data-platform",
      "api",
      "integrations",
      "addon",
      "addon-import.service.js"
    )
  ).href;

const {
  prisma
} =
  await import(
    prismaClientUrl
  );

const {
  AddonImportPersistence
} =
  await import(
    persistenceUrl
  );

const {
  AddonImportService
} =
  await import(
    serviceUrl
  );

const source =
  fs.readFileSync(
    savedVariablesPath,
    "utf8"
  );

const persistence =
  new AddonImportPersistence();

const service =
  new AddonImportService(
    persistence
  );

async function readCounts() {
  const [
    characters,
    assignments,
    trees,
    nodes,
    addonProgress
  ] =
    await Promise.all([
      prisma.character.count(),
      prisma.characterProfession.count(),
      prisma.professionSpecializationTree.count(),
      prisma.professionSpecializationNode.count(),
      prisma.characterProfessionNodeProgress.count({
        where: {
          source:
            "ADDON"
        }
      })
    ]);

  return {
    characters,
    assignments,
    trees,
    nodes,
    addonProgress
  };
}

try {
  console.log(
    `Backend cwd: ${process.cwd()}`
  );

  console.log(
    `SavedVariables: ${savedVariablesPath}`
  );

  const firstImport =
    await service
      .importSavedVariables(
        source
      );

  const firstCounts =
    await readCounts();

  const secondImport =
    await service
      .importSavedVariables(
        source
      );

  const secondCounts =
    await readCounts();

  console.log(
    JSON.stringify(
      {
        firstImport,
        secondImport,
        database:
          secondCounts
      },
      null,
      2
    )
  );

  if (
    firstImport
      .processed
      .characters <
    1
  ) {
    throw new Error(
      "No characters were persisted."
    );
  }

  if (
    firstImport
      .processed
      .professionAssignments <
    1
  ) {
    throw new Error(
      "No profession assignments were persisted."
    );
  }

  if (
    firstImport
      .processed
      .progressEntries <
    1
  ) {
    throw new Error(
      "No specialization progress was persisted."
    );
  }

  if (
    JSON.stringify(
      firstCounts
    ) !==
    JSON.stringify(
      secondCounts
    )
  ) {
    throw new Error(
      "Second import changed database row counts. Import is not idempotent."
    );
  }

  console.log("");
  console.log(
    "SQLite SavedVariables import validation passed."
  );
}
finally {
  await prisma.$disconnect();
}
