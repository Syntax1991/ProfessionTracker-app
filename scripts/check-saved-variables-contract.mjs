import assert from "node:assert/strict";
import { LuaSavedVariablesParser } from "../apps/api/dist/modules/data-platform/api/integrations/addon/lua-saved-variables.parser.js";
import { normalizeAddonSnapshot } from "../apps/api/dist/modules/data-platform/api/integrations/addon/addon-import.normalizer.js";
import { AddonImportService } from "../apps/api/dist/modules/data-platform/api/integrations/addon/addon-import.service.js";

function createFixture(
  variableName,
  schemaVersion
) {
  const formatLine =
    variableName ===
    "SynTrackCoreDB"
      ? '  ["format"] = "syntrack-saved-variables",\n'
      : "";

  return `${variableName} = {
${formatLine}  ["schemaVersion"] = ${schemaVersion},
  ["coreSchemaVersion"] = 1,
  ["addonVersion"] = "0.1.0",
  ["client"] = {
    ["version"] = "12.0.7",
    ["build"] = "test",
    ["interfaceVersion"] = 120007
  },
  ["characters"] = {
    ["eu:testrealm:tester"] = {
      ["key"] = "eu:testrealm:tester",
      ["name"] = "Tester",
      ["realm"] = "TestRealm",
      ["region"] = "EU",
      ["className"] = "Mage",
      ["level"] = 90,
      ["lastUpdatedAt"] = 1786579200,
      ["modules"] = {}
    }
  }
}`;
}

const service =
  new AddonImportService({});

for (
  const [
    variableName,
    schemaVersion
  ] of
  [
    ["ProfessionTrackerDB", 10],
    ["SynTrackCoreDB", 1]
  ]
) {
  const source =
    createFixture(
      variableName,
      schemaVersion
    );

  const root =
    new LuaSavedVariablesParser(
      source
    ).parse();

  const snapshot =
    normalizeAddonSnapshot(
      root
    );

  assert.equal(
    snapshot.schemaVersion,
    schemaVersion
  );

  assert.equal(
    snapshot.characters.length,
    1
  );

  assert.equal(
    snapshot.characters[0].key,
    "eu:testrealm:tester"
  );

  const preview =
    service.preview(
      source
    );

  assert.equal(
    preview.schemaVersion,
    schemaVersion
  );
}

assert.throws(
  () =>
    new LuaSavedVariablesParser(
      createFixture(
        "UnsupportedAddonDB",
        10
      )
    ).parse(),
  /supported SynTrack SavedVariables/u
);

assert.throws(
  () =>
    service.preview(
      createFixture(
        "SynTrackCoreDB",
        2
      )
    ),
  /Supported version is 1/u
);

console.log(
  "SavedVariables contract check passed for ProfessionTrackerDB and SynTrackCoreDB."
);
