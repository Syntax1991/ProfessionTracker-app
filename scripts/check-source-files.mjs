import {
  readdir,
  readFile
} from "node:fs/promises";
import path from "node:path";

const maximumLines = 350;

const sourceRoots = [
  "apps/api/src",
  "apps/web/src",
  "modules",
  "scripts"
];

const checkedExtensions =
  new Set([
    ".ts",
    ".tsx",
    ".css",
    ".lua",
    ".toc",
    ".mjs",
    ".js",
    ".cjs"
  ]);

async function findSourceFiles(
  directory
) {
  const entries =
    await readdir(
      directory,
      {
        withFileTypes: true
      }
    );

  const files = [];

  for (
    const entry of
    entries
  ) {
    if (
      entry.name ===
      "generated"
    ) {
      continue;
    }

    const entryPath =
      path.join(
        directory,
        entry.name
      );

    if (
      entry.isDirectory()
    ) {
      files.push(
        ...(
          await findSourceFiles(
            entryPath
          )
        )
      );

      continue;
    }

    if (
      checkedExtensions.has(
        path.extname(
          entry.name
        )
      )
    ) {
      files.push(
        entryPath
      );
    }
  }

  return files;
}

const sourceGroups =
  await Promise.all(
    sourceRoots.map(
      (sourceRoot) =>
        findSourceFiles(
          sourceRoot
        )
    )
  );

const sourceFiles =
  sourceGroups.flat();

const violations = [];

for (
  const sourceFile of
  sourceFiles
) {
  const content =
    await readFile(
      sourceFile,
      "utf8"
    );

  const lineCount =
    content
      .split(
        /\r?\n/u
      )
      .length;

  if (
    lineCount >
    maximumLines
  ) {
    violations.push({
      sourceFile,
      lineCount
    });
  }
}

if (
  violations.length > 0
) {
  console.error(
    `Source files may not exceed ${maximumLines} lines.`
  );

  for (
    const violation of
    violations
  ) {
    console.error(
      `- ${violation.sourceFile}: ${violation.lineCount} lines`
    );
  }

  process.exit(1);
}

console.log(
  `Architecture check passed for ${sourceFiles.length} source files.`
);
