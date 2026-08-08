import fs from "node:fs";
import process from "node:process";
import { LuaSavedVariablesParser } from "../backend/dist/modules/integrations/addon/lua-saved-variables.parser.js";
import { normalizeAddonSnapshot } from "../backend/dist/modules/integrations/addon/addon-import.normalizer.js";
import { createAddonImportPreview } from "../backend/dist/modules/integrations/addon/addon-import.preview.js";

const savedVariablesPath =
  process.argv[2];

if (!savedVariablesPath) {
  throw new Error(
    "SavedVariables path is required."
  );
}

const source =
  fs.readFileSync(
    savedVariablesPath,
    "utf8"
  );

const root =
  new LuaSavedVariablesParser(
    source
  ).parse();

const snapshot =
  normalizeAddonSnapshot(
    root
  );

const preview =
  createAddonImportPreview(
    snapshot
  );

console.log(
  JSON.stringify(
    {
      file:
        savedVariablesPath,
      addonVersion:
        preview.addonVersion,
      schemaVersion:
        preview.schemaVersion,
      client:
        preview.client,
      totals:
        preview.totals,
      catalogs:
        preview.catalogs.length,
      characters:
        preview.characters.map(
          (character) => ({
            name:
              character.name,
            realm:
              character.realm,
            professions:
              character.professions.map(
                (profession) => ({
                  name:
                    profession.name,
                  skill:
                    `${profession.skillLevel}/${profession.maxSkillLevel}`,
                  expansions:
                    profession.expansions,
                  investedKnowledge:
                    profession.investedKnowledge
                })
              )
          })
        )
    },
    null,
    2
  )
);

if (
  preview.schemaVersion !== 4
) {
  throw new Error(
    `Expected schema version 4, received ${preview.schemaVersion}.`
  );
}

if (
  preview.characters.length < 1
) {
  throw new Error(
    "No characters were parsed."
  );
}

if (
  preview.catalogs.length < 1
) {
  throw new Error(
    "No profession catalogs were parsed."
  );
}

if (
  preview.totals.professionAssignments <
  1
) {
  throw new Error(
    "No profession assignments were parsed."
  );
}

if (
  preview.totals.investedNodes <
  1
) {
  throw new Error(
    "No invested specialization nodes were parsed."
  );
}

console.log("");
console.log(
  "SavedVariables validation passed."
);