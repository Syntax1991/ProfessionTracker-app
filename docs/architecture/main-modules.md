# SynTrack Main Modules

## Purpose

SynTrack is a platform, not a single profession tracker.

Every major feature must belong to one explicit main module. Main
modules define business ownership and prevent unrelated features from
growing into one large coupled application.

## Module map

```text
SynTrack
|
+-- My SynTrack
|   +-- My Characters
|   +-- Weekly Checklist
|   +-- Vault / M+
|   +-- Raid Tasks
|   +-- Gear / Enchants / Gems
|   +-- Professions
|
+-- Guild
|   +-- Dashboard
|   +-- Roster
|   +-- Teams
|   +-- Attendance
|   +-- Weekly Progress
|   +-- Requirements
|   +-- Officer Notes
|
+-- Raid
|   +-- Raid Planner
|   +-- Boss Rosters
|   +-- Assignments
|   +-- Cooldowns
|   +-- Raid Notes
|   +-- Attendance
|   +-- WCL Analysis
|
+-- Loot
|   +-- Wishlist
|   +-- Droptimizer
|   +-- Loot Council
|   +-- Loot History
|   +-- Tier / Token Planning
|   +-- Split Planning
|
+-- Professions
|   +-- Crafter Finder
|   +-- Recipes
|   +-- Knowledge
|   +-- Specializations
|   +-- Material Quality
|   +-- Concentration
|   +-- Craft Recommendations
|
+-- Recruitment
|   +-- Applications
|   +-- Raider.io
|   +-- Warcraft Logs
|   +-- Availability
|   +-- Trial Tracking
|   +-- Recruitment Board
|
+-- Automation
|   +-- Discord Bot
|   +-- Reminders
|   +-- Missing Weeklies
|   +-- Raid Signup Alerts
|   +-- Officer Alerts
|
+-- Data Platform
    +-- Battle.net
    +-- Raider.io
    +-- Warcraft Logs
    +-- SynTrack Addon
    +-- SynTrack Companion
```

## 1. My SynTrack

### Responsibility

Personal workspace for the logged-in player.

It aggregates user-specific information from other modules without
owning their underlying business rules.

### Examples

- personal characters
- weekly checklist
- Great Vault and Mythic+ progress
- personal raid tasks
- missing enchants and gems
- personal profession status

### Dependency rule

My SynTrack may read projections from Guild, Raid, Loot and
Professions.

It must not implement duplicate profession, raid or loot logic.

## 2. Guild

### Responsibility

Guild organization and persistent guild state.

### Owns

- guild roster
- teams
- attendance policy and guild-level attendance views
- weekly guild progress
- guild requirements
- officer notes

### Does not own

- boss-specific raid assignments
- loot decisions
- recruitment application lifecycle

## 3. Raid

### Responsibility

Raid preparation, execution and analysis.

### Owns

- raid events
- raid planner
- boss rosters
- assignments
- cooldown planning
- raid notes
- raid attendance views
- Warcraft Logs raid analysis

### Dependency rule

Raid may reference Guild members and Teams but does not own the guild
roster.

## 4. Loot

### Responsibility

Loot planning and distribution.

### Owns

- wishlists
- Droptimizer data
- loot council decisions
- loot history
- tier and token planning
- split planning

### Dependency rule

Loot references Raid events and Guild members through stable
identifiers or contracts.

## 5. Professions

### Responsibility

All crafting and profession intelligence.

### Owns

- crafter finder
- recipes
- profession knowledge
- specialization trees
- material quality
- concentration
- crafting operations
- minimum sufficient material recommendations
- craft recommendations

### Existing implementation

The current profession implementation is physically grouped beneath
the Professions main module.

Web:

- `modules/professions/web`
- `modules/professions/web/details`
- `modules/professions/web/specializations`

API:

- `modules/professions/api`
- `modules/professions/api/details`
- `modules/professions/api/specializations`

Module-owned addon:

- `modules/professions/addons/ProfessionTracker`

The technical addon name remains unchanged to preserve existing WoW
SavedVariables.

## 6. Recruitment

### Responsibility

Applicant and trial lifecycle.

### Owns

- applications
- Raider.io applicant information
- Warcraft Logs applicant information
- availability
- trial tracking
- recruitment board

### Dependency rule

Accepted recruits may transition into Guild membership through an
explicit application service.

## 7. Automation

### Responsibility

Cross-module triggers and notifications.

### Owns

- Discord bot workflows
- reminders
- missing weekly alerts
- raid signup alerts
- officer alerts

### Dependency rule

Automation consumes events and read models from other modules.

Automation must not become the owner of the business state that caused
an alert.

## 8. Data Platform

### Responsibility

External integrations, ingestion, synchronization and transport.

### Owns

- Battle.net integration
- Raider.io integration
- Warcraft Logs integration
- SynTrack Addon ingestion
- SynTrack Companion synchronization
- import validation
- external identity mapping
- synchronization metadata

### Existing implementation

Web:

- `modules/data-platform/web/integrations`

API:

- `modules/data-platform/api/integrations`

### Dependency rule

Data Platform gathers and normalizes data.

Business interpretation belongs to the consuming domain.

For example:

- Data Platform imports crafting data.
- Professions determines craft recommendations.
- Data Platform imports Warcraft Logs.
- Raid performs raid analysis.
- Data Platform imports Raider.io.
- Recruitment evaluates applicant context.

## Current My SynTrack implementation

Personal character and weekly-readiness features are grouped beneath
My SynTrack.

Web:

- `modules/my-syntrack/web/characters`
- `modules/my-syntrack/web/dashboard`
- `modules/my-syntrack/web/weekly-checklist`
- `modules/my-syntrack/web/vault-mythic-plus`
- `modules/my-syntrack/web/raid-tasks`

API:

- `modules/my-syntrack/api/characters`
- `modules/my-syntrack/api/dashboard`
- `modules/my-syntrack/api/weekly-checklist`
- `modules/my-syntrack/api/vault-mythic-plus`
- `modules/my-syntrack/api/raid-tasks`

## Web structure

Module-owned frontend code lives with its domain. The web app contains
only application composition and genuinely shared UI.

```text
apps/web/src
|
+-- app
|   +-- modules
|   +-- routing
+-- shared
+-- styles

modules/<main-module>/web
|
+-- pages
+-- components
+-- hooks
+-- api
+-- types
```

Planned modules receive a `web` directory only with their first real
frontend capability.

## API structure

Module-owned backend code lives with its domain. The API app contains
server startup, route composition, Prisma and shared infrastructure.

```text
apps/api/src
|
+-- server.ts
+-- app.ts
+-- routes
+-- infrastructure
+-- shared

modules/<main-module>/api
|
+-- controllers
+-- services
+-- repositories
+-- routes
```

Feature-level Route -> Controller -> Service -> Repository boundaries
remain inside the owning main module.

## Repository layout

Main modules own business code. Apps are thin deployable runtimes that
compose those modules.

Every module has a permanent addon boundary. API and web directories
are capability-driven and appear when the module implements them.

```text
SynTrack
|
+-- modules
|   +-- <main-module>
|       +-- README.md
|       +-- addons
|       |   +-- README.md
|       |   +-- <AddonName>        (when implemented)
|       +-- api                    (when implemented)
|       +-- web                    (when implemented)
|
+-- apps
|   +-- api
|   +-- web
+-- docs
+-- scripts
```

The root `modules` directory is the single source location for all
domain-specific API, web and addon code. `apps` contains only runtime
composition and shared application infrastructure.

### Why the Web app remains under `apps`

`modules` and `apps` answer different ownership questions:

- `modules/<main-module>` owns a business domain and all of its API,
  web and WoW-addon capabilities.
- `apps/web` is the executable browser application. It bootstraps React,
  supplies the shared layout and routing, and composes module pages.
- `apps/api` is the executable server. It starts the process, supplies
  shared infrastructure and mounts module routes.

The Web app is therefore not a ninth business module. Moving it to
`modules/webapp` would create a technical catch-all that owns parts of
every domain and would weaken the module boundaries. The same rule
applies to future executable products such as a Companion or Discord
bot: their runtime shell may live under `apps`, while their business
workflows remain in the owning main module.

If several independently deployable services or shared packages are
introduced later, shared technical packages may be added without
changing the domain ownership model:

```text
SynTrack
|
+-- packages
|   +-- contracts
|   +-- shared
|   +-- wow-data
+-- docs
+-- scripts
```

The project remains one Git repository unless release cadence, access
control or team ownership later requires a split.

## Migration sequence

### Phase 18A - Main-module foundation

- establish module registry
- document module ownership
- group website navigation by module
- align project metadata with SynTrack branding

### Phase 18B - Frontend domain migration

Completed for currently implemented capabilities:

- `my-syntrack`
- `professions`
- `data-platform`

### Phase 18C - Backend domain migration

Completed for currently implemented capabilities beneath the same
three owning modules.

Preserve Route -> Controller -> Service -> Repository -> Prisma.

### Phase 18D - Module-first monorepo

Completed for current production code:

- move application shells to `apps/api` and `apps/web`
- colocate API, web and addon source under each owning module
- retain one repository and one root verification workflow

### Phase 18E - New capabilities

The root manifests establish Guild, Raid, Loot, Recruitment and
Automation. API and web directories are created only with the first
real capability.

Do not create large empty module trees.

### Later - Additional applications and packages

Add the Companion or reusable technical packages beneath `apps` and
`packages` while module business logic remains beneath `modules`.

## Dependency principles

1. A business rule has exactly one owning main module.
2. Modules communicate through explicit contracts or application
   services.
3. Frontend pages may compose read models from multiple modules.
4. Data Platform normalizes external data but does not own domain
   decisions.
5. Automation reacts to domain events but does not own source state.
6. My SynTrack aggregates personal state but does not duplicate
   business rules.
7. Shared code must remain genuinely domain-neutral.
8. New features must declare their owning main module before
   implementation.
9. Cross-module database relations use stable identifiers.
10. Circular module dependencies are not allowed.

## WoW addons and Companion

SynTrack supports multiple module-owned WoW addons. Their source lives
under `modules/<main-module>/addons/<technical-name>`.

Every main module contains an `addons` directory even before its first
addon exists. The directory itself is only the module boundary; each
real addon must be placed in a separate technical-name subdirectory so
several addons can coexist without mixing source files.

The current profession addon therefore lives under Professions. Future
Raid, Guild or personal-tracking addons can live under their respective
main modules without growing one global addon directory.

Data Platform owns the shared import, validation, identity and
synchronization contracts. Addons and the future SynTrack Companion use
those contracts but do not transfer their business ownership to Data
Platform.
