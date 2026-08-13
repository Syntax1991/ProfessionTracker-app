# SynTrack

SynTrack is a modular World of Warcraft guild, raid, loot,
profession and player tracking platform.

The project started as a profession tracking tool. The platform now
uses explicit main-module boundaries so additional guild-management
features can be added without coupling them to the profession system.

## Main modules

SynTrack is divided into eight primary domains:

1. My SynTrack
2. Guild
3. Raid
4. Loot
5. Professions
6. Recruitment
7. Automation
8. Data Platform

The complete capability map and dependency rules are documented in:

`docs/architecture/main-modules.md`

## Current implementation

The existing production code currently covers parts of:

- My SynTrack
  - Dashboard
  - Characters
  - Weekly Checklist
  - Vault / Mythic+
  - Raid Tasks
- Professions
  - Profession overview
  - Profession details
  - Specializations
  - Recipes
  - Crafter information
  - Material quality simulations
  - Craft recommendations
- Data Platform
  - Battle.net integration
  - SynTrack Addon import
  - Addon SavedVariables capture

Guild, Raid, Loot, Recruitment and Automation are established as
platform domains and will be implemented incrementally.

## Architecture

Backend dependency flow:

Route -> Controller -> Service -> Repository -> Prisma

Frontend structure:

- `apps/web`: executable Web shell, routing, application composition,
  shared UI and styles
- `modules/<main-module>/web`: module-owned pages, components, hooks and APIs

Backend structure:

- `apps/api`: executable server shell, route composition, Prisma and
  shared infrastructure
- `modules/<main-module>/api`: module-owned controllers, services and repositories

Each business module keeps its API, web and addon code together beneath
`modules`. Every module has an `addons` directory, and every real addon
lives in its own `addons/<technical-name>` subdirectory. The complete
project remains one Git monorepo.

`apps/web` and `apps/api` are not business modules. They are executable
entrypoints that assemble the main modules into deployable products.

Source files are limited to 350 lines by an automated architecture
check.

## Platform ownership

My SynTrack is a personalized projection layer. It may present data
from Guild, Raid, Loot and Professions, but does not duplicate their
business rules.

Data Platform owns external data ingestion and synchronization.

Automation owns triggers, reminders and notifications.

Each addon belongs to the main module whose game-side capability it
implements. Data Platform owns the shared ingestion and synchronization
contracts used by those addons and by the future SynTrack Companion.

## Local development

Run from PowerShell:

```powershell
cd D:\Projects\SynTrack
npm install
npm run dev
```

Frontend:

`http://localhost:5173`

Backend:

`http://localhost:4000/api/health`

## Verification

Run:

```powershell
npm run verify
```

This performs:

- architecture checks
- web lint
- API build
- web build

## Battle.net configuration

Add credentials only to `apps/api/.env`:

```text
BATTLENET_CLIENT_ID=
BATTLENET_CLIENT_SECRET=
```

Never commit real credentials.

## WoW addon compatibility

The public product name is SynTrack.

For compatibility with existing SavedVariables, the internal WoW
addon folder and SavedVariables database still use the historical
technical identifiers:

- `modules/professions/addons/ProfessionTracker`
- `ProfessionTracker.toc`
- `ProfessionTrackerDB`

Those identifiers will only be renamed through a dedicated migration
that preserves existing user data.
