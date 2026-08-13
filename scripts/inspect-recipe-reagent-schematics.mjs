import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";
import {
  inspectRecipeReagentSchematics
} from "./recipe-reagent-schematic-inspector.mjs";

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

const parserUrl =
  pathToFileURL(
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
    )
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

const result =
  inspectRecipeReagentSchematics(
    root
  );

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);

if (
  result.recipesWithSchema ===
  0
) {
  console.warn("");
  console.warn(
    "No reagent schematics were captured."
  );
}
