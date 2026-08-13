# Raid

Raid preparation, execution and analysis.

Being built step by step (one capability per pass) rather than all at
once. Reference: WoWAudit and WoWUtils were researched directly
(2026-08-14, see the `project_wowaudit_reference` memory) to shape
the remaining steps — notably, Assignments/Cooldowns should lean
toward an interactive planner with in-game addon export (WoWUtils'
"Curio" model) rather than free-text notes, and Attendance/WCL
Analysis should eventually be backed by real Warcraft Logs data
rather than manual entry.

## Capabilities

- Raid Planner (available)
- Boss Rosters (planned)
- Assignments (planned)
- Cooldowns (planned)
- Raid Notes (planned)
- raid-event Attendance (planned)
- Warcraft Logs Analysis (planned)

Raid references Guild members and teams through explicit contracts; it
does not own the guild roster.

## Current source

- API: `modules/raid/api/planner`
- Web: `modules/raid/web/planner`

## Raid Planner

`RaidEvent` (title, raid instance, difficulty, scheduled date/time,
optional link to a `GuildTeam`, notes). The link to `GuildTeam` is a
loose `teamId` string, not a Prisma foreign key — Raid references
Guild's team by stable ID rather than taking on a hard schema
dependency, matching the "cross-module relations use stable
identifiers" architecture principle. `RaidPlannerService` reuses
Guild's `GuildVerificationGuard` directly (same verification, since
raid officers are guild officers) so mutations require the same
verified leadership link as Guild's own features; the event list
remains open to read. The web page reuses Guild's
`GuildVerificationGate` and `useTeams` hook directly (cross-module
frontend composition, not duplicated logic).
