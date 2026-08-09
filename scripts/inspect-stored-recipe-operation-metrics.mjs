import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";
import {
  createStoredRecipeOperationMetricReport
} from "./recipe-operation-metric-report.mjs";

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

process.chdir(
  backendRoot
);

const prismaClientUrl =
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
  prisma
} =
  await import(
    prismaClientUrl
  );

try {
  const recipes =
    await prisma.craftRecipe.findMany({
      select: {
        gameRecipeId: true,
        name: true,
        operationMetricsJson: true,

        profession: {
          select: {
            name: true
          }
        }
      }
    });

  const report =
    createStoredRecipeOperationMetricReport(
      recipes
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