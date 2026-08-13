import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";

import {
  buildCharacterRecipeOperationReport
} from "./character-recipe-operation-report.mjs";

const currentFile =
  fileURLToPath(import.meta.url);

const projectRoot =
  path.resolve(
    path.dirname(currentFile),
    ".."
  );

const savedVariablesPath =
  process.argv[2];

if (!savedVariablesPath) {
  throw new Error(
    "SavedVariables path is required."
  );
}

if (!fs.existsSync(savedVariablesPath)) {
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
  pathToFileURL(parserPath).href;

const {
  LuaSavedVariablesParser
} =
  await import(parserUrl);

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
  buildCharacterRecipeOperationReport(
    root
  );

console.log(
  JSON.stringify(
    report,
    null,
    2
  )
);

if (report.totals.captures === 0) {
  console.error(
    "No character recipe operation captures were found."
  );

  process.exitCode = 2;
}
