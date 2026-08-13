import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";
import {
  assertProfessionRecipeOperationApiReport,
  createProfessionRecipeOperationApiReport
} from "./profession-recipe-operation-api-report.mjs";

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

process.chdir(
  backendRoot
);

function moduleUrl(
  ...parts
) {
  return pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      ...parts
    )
  ).href;
}

const {
  prisma
} =
  await import(
    moduleUrl(
      "apps",
      "api",
      "src",
      "infrastructure",
      "database",
      "prismaClient.js"
    )
  );

const {
  ProfessionDetailRepository
} =
  await import(
    moduleUrl(
      "modules",
      "professions",
      "api",
      "details",
      "profession-detail.repository.js"
    )
  );

const {
  ProfessionRecipeRepository
} =
  await import(
    moduleUrl(
      "modules",
      "professions",
      "api",
      "details",
      "profession-recipe.repository.js"
    )
  );

const {
  ProfessionDetailService
} =
  await import(
    moduleUrl(
      "modules",
      "professions",
      "api",
      "details",
      "profession-detail.service.js"
    )
  );

try {
  const professions =
    await prisma.profession.findMany({
      select: {
        id: true,
        name: true
      },

      orderBy: [
        {
          order: "asc"
        },
        {
          name: "asc"
        }
      ]
    });

  const service =
    new ProfessionDetailService(
      new ProfessionDetailRepository(),
      new ProfessionRecipeRepository()
    );

  const report =
    await createProfessionRecipeOperationApiReport(
      service,
      professions
    );

  assertProfessionRecipeOperationApiReport(
    report
  );

  console.log(
    JSON.stringify(
      report,
      null,
      2
    )
  );
}
finally {
  await prisma.$disconnect();
}
