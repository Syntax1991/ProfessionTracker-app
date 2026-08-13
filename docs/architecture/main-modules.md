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

Most of the current SynTrack code belongs to this module.

Current frontend feature directories:

- `profession-details`
- `professions`
- `specializations`

Current backend module directories:

- `profession-details`
- `professions`
- `specializations`

These directories will be moved beneath the Professions domain in a
dedicated structural migration.

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

Current frontend feature directory:

- `integrations`

Current backend module directory:

- `integrations`

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

## Current My SynTrack mapping

The current generic character and dashboard features become part of
My SynTrack.

Frontend:

- `characters`
- `dashboard`

Backend:

- `characters`
- `dashboard`

This is an ownership assignment first. Physical directory moves happen
in a later migration.

## Frontend target structure

Long-term target:

```text
frontend/src
|
+-- app
|   +-- modules
|   +-- routing
|
+-- features
|   +-- my-syntrack
|   +-- guild
|   +-- raid
|   +-- loot
|   +-- professions
|   +-- recruitment
|   +-- automation
|   +-- data-platform
|
+-- shared
+-- styles
```

Each domain can contain its own pages, components, hooks, APIs and
models.

## Backend target structure

Long-term target:

```text
backend/src/modules
|
+-- my-syntrack
+-- guild
+-- raid
+-- loot
+-- professions
+-- recruitment
+-- automation
+-- data-platform
```

Feature-level Route -> Controller -> Service -> Repository boundaries
remain inside the owning main module.

## Repository applications

The main modules describe business ownership.

Deployable applications are a different architectural dimension.

Future repository target:

```text
SynTrack
|
+-- apps
|   +-- web
|   +-- api
|   +-- companion
|
+-- addons
|   +-- syntrack
|
+-- packages
|   +-- contracts
|   +-- shared
|   +-- wow-data
|
+-- docs
+-- scripts
```

We do not perform this complete physical move in one commit.

## Migration sequence

### Phase 18A - Main-module foundation

- establish module registry
- document module ownership
- group website navigation by module
- align project metadata with SynTrack branding

### Phase 18B - Frontend domain migration

Move current features into:

- `my-syntrack`
- `professions`
- `data-platform`

Update all imports and routes while preserving behavior.

### Phase 18C - Backend domain migration

Move backend capabilities beneath the same three owning modules.

Preserve Route -> Controller -> Service -> Repository -> Prisma.

### Phase 18D - New domain skeletons

Create Guild, Raid, Loot, Recruitment and Automation only when their
first real capability is implemented.

Do not create large empty module trees.

### Later - Application monorepo migration

When the Companion and additional platform services are implemented,
move deployable applications toward `apps`, `addons` and `packages`.

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

## WoW addon and Companion

The SynTrack Addon and SynTrack Companion are platform data clients.

They belong architecturally to Data Platform.

Profession-specific capture logic may exist inside the Addon, but the
Addon itself must remain capable of transporting future guild, raid,
weekly and character data without becoming owned by Professions.