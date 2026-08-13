# SynTrack Core

`SynTrack_Core` is the shared runtime and SavedVariables transport for
SynTrack's WoW addons. It deliberately contains no profession, raid,
loot or guild business rules.

## Responsibilities

- stable region, realm and character identity
- shared `SynTrack` API for dependent addons
- module registration and character/account capture scopes
- small in-process event bus
- import-compatible `SynTrackCoreDB` SavedVariables envelope

## Installation

Copy `SynTrack_Core` into the WoW Retail addon directory and enable it
for the account. Future SynTrack addons declare `SynTrack_Core` as a
required dependency in their TOC file.

## Commands

```text
/stcore status
/stcore capture
/stcore modules
```

`/stcore capture` refreshes the in-memory data. WoW writes
SavedVariables during logout or `/reload`.

## Module contract

A dependent addon registers after Core has loaded:

```lua
SynTrack.RegisterModule({
    id = "raid-planner",
    name = "Raid Planner",
    version = "0.1.0",
    schemaVersion = 1,
    scope = "character",
    capture = function(context)
        return {
            character = context.character.key
        }
    end
})
```

Module IDs are lowercase and may contain numbers and hyphens. Scope is
either `character` or `account`. Capture payloads must only contain
values that WoW can persist in SavedVariables.

## SavedVariables contract

`SynTrackCoreDB` uses SavedVariables schema version `1` and Core API
schema version `1`. Characters retain the flat identity fields used by
the existing importer, while module-owned payloads live below
`characters[characterKey].modules` or `accountModules`.

```text
SynTrackCoreDB
  format
  schemaVersion
  coreSchemaVersion
  addonVersion
  client
  characters
  modules
  accountModules
```

The historical profession addon and `ProfessionTrackerDB` remain
supported. Migrating its capture logic into the Core module contract is
a separate feature and does not require deleting existing data.
