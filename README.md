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

- `app`: routing, main-module registry and application composition
- `features`: implemented business capabilities
- `shared`: reusable UI and infrastructure
- `styles`: separated visual responsibilities

Backend structure:

- `modules`: business capabilities and integrations
- `shared`: shared backend infrastructure where applicable

The current feature directories will be moved under their owning
main modules incrementally. This avoids one large high-risk repository
move while the profession data pipeline is still under active
development.

Source files are limited to 350 lines by an automated architecture
check.

## Platform ownership

My SynTrack is a personalized projection layer. It may present data
from Guild, Raid, Loot and Professions, but does not duplicate their
business rules.

Data Platform owns external data ingestion and synchronization.

Automation owns triggers, reminders and notifications.

The SynTrack Addon and future SynTrack Companion are ingestion clients
of Data Platform rather than profession-specific applications.

## Local development

Run from PowerShell:

```powershell
cd D:\Projects\SynTrack
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
- frontend lint
- backend build
- frontend build

## Battle.net configuration

Add credentials only to `backend/.env`:

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

- `addon/ProfessionTracker`
- `ProfessionTracker.toc`
- `ProfessionTrackerDB`

Those identifiers will only be renamed through a dedicated migration
that preserves existing user data.