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

function incrementCount(
  target,
  value
) {
  const key =
    String(
      value ?? "null"
    );

  target[key] =
    (
      target[key] ??
      0
    ) + 1;
}

try {
  const rows =
    await prisma
      .characterCraftRecipe
      .findMany({
        where: {
          operationMetricsJson: {
            not: null
          }
        },

        select: {
          baseSkill: true,
          bonusSkill: true,
          effectiveSkill: true,
          craftingQuality: true,
          craftingQualityId: true,
          guaranteedCraftingQualityId: true,
          lowerSkillThreshold: true,
          upperSkillThreshold: true,
          concentrationCost: true,
          concentrationCurrencyId: true,
          ingenuityRefund: true,
          quality: true,
          operationCapturedAt: true,
          operationCaptureVersion: true,
          operationScopeVersion: true,

          recipe: {
            select: {
              gameRecipeId: true,
              name: true,
              skillLineId: true
            }
          },

          characterProfession: {
            select: {
              character: {
                select: {
                  name: true,
                  realm: true,
                  region: true
                }
              },

              profession: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

  const characters =
    new Set();

  const professions =
    new Set();

  const captureVersions =
    {};

  const scopeVersions =
    {};

  let effectiveSkillChecked =
    0;

  let effectiveSkillMismatches =
    0;

  let concentrationRows =
    0;

  let qualityRows =
    0;

  for (const row of rows) {
    const character =
      row.characterProfession.character;

    characters.add(
      [
        character.region,
        character.realm,
        character.name
      ].join(":")
    );

    professions.add(
      row.characterProfession
        .profession
        .name
    );

    incrementCount(
      captureVersions,
      row.operationCaptureVersion
    );

    incrementCount(
      scopeVersions,
      row.operationScopeVersion
    );

    if (
      row.baseSkill !== null &&
      row.bonusSkill !== null &&
      row.effectiveSkill !== null
    ) {
      effectiveSkillChecked +=
        1;

      if (
        row.effectiveSkill !==
        row.baseSkill +
          row.bonusSkill
      ) {
        effectiveSkillMismatches +=
          1;
      }
    }

    if (
      row.concentrationCost !==
      null
    ) {
      concentrationRows +=
        1;
    }

    if (
      row.quality !==
      null
    ) {
      qualityRows +=
        1;
    }
  }

  const samples =
    rows
      .slice(0, 25)
      .map(
        (row) => ({
          character:
            row.characterProfession
              .character
              .name,

          profession:
            row.characterProfession
              .profession
              .name,

          gameRecipeId:
            row.recipe.gameRecipeId,

          recipe:
            row.recipe.name,

          baseSkill:
            row.baseSkill,

          bonusSkill:
            row.bonusSkill,

          effectiveSkill:
            row.effectiveSkill,

          craftingQuality:
            row.craftingQuality,

          quality:
            row.quality,

          concentrationCost:
            row.concentrationCost,

          captureVersion:
            row.operationCaptureVersion,

          scopeVersion:
            row.operationScopeVersion
        })
      );

  const report = {
    operationRows:
      rows.length,

    characters:
      characters.size,

    professions:
      professions.size,

    captureVersions,

    scopeVersions,

    effectiveSkillChecked,

    effectiveSkillMismatches,

    qualityRows,

    concentrationRows,

    samples
  };

  console.log(
    JSON.stringify(
      report,
      null,
      2
    )
  );

  if (rows.length === 0) {
    console.error(
      "No stored character recipe operations were found."
    );

    process.exitCode =
      2;
  }

  if (
    effectiveSkillMismatches >
    0
  ) {
    console.error(
      "Stored effective skill does not equal baseSkill + bonusSkill."
    );

    process.exitCode =
      3;
  }
}
finally {
  await prisma.$disconnect();
}