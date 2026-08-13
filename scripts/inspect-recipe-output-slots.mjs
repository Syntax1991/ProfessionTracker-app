import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";

import {
  buildRecipeOutputSlotReport
} from "./recipe-output-slot-report.mjs";

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

const parserPath =
  path.join(
    projectRoot,
    "apps/api",
    "dist",
    "modules",
    "data-platform",
    "api",
    "integrations",
    "addon",
    "lua-saved-variables.parser.js"
  );

if (!fs.existsSync(parserPath)) {
  throw new Error(
    "Built Lua parser was not found. Run npm run verify first."
  );
}

const parserUrl =
  pathToFileURL(
    parserPath
  ).href;

const {
  LuaSavedVariablesParser
} =
  await import(
    parserUrl
  );

const source =
  fs.readFileSync(
    savedVariablesPath,
    "utf8"
  );

const root =
  new LuaSavedVariablesParser(
    source
  ).parse();

const report =
  buildRecipeOutputSlotReport(
    root
  );

console.log(
  JSON.stringify(
    report,
    null,
    2
  )
);

if (
  !report.validation
    .schema10OrNewer
) {
  console.error(
    "SavedVariables are older than schema 10."
  );

  process.exitCode = 2;
}
else if (
  !report.validation
    .hasOutputItemIds
) {
  console.error(
    "Schema 10 is present, but no recipe output item IDs were captured. Open the profession windows and capture again."
  );

  process.exitCode = 3;
}
else if (
  !report.validation
    .hasEquipLocs
) {
  console.error(
    "Output items were captured, but no equipment locations were resolved."
  );

  process.exitCode = 4;
}
else if (
  !report.validation
    .hasExactFamilyEquipmentSlots
) {
  console.error(
    "Equipment families exist, but none have an exact equipment slot."
  );

  process.exitCode = 5;
}
