# Raid

Raid preparation, execution and analysis.

Being built step by step (one capability per pass) rather than all at
once — an explicit, repeated instruction from the product owner, not
just a style preference. Reference: WoWAudit and WoWUtils were
researched directly (2026-08-14, see the `project_wowaudit_reference`
memory) to shape the remaining steps — notably, Assignments/Cooldown
Planning should lean toward an interactive planner with in-game addon
export (WoWUtils' "Curio" model) rather than free-text notes.

## Capabilities

Breakdown refined 2026-08-14 by the full product vision (see the
`project_syntrack_vision` memory) — this supersedes the original
7-item list. Warcraft Logs analysis moved out to a separate,
not-yet-started Progress Intelligence main module; raid-specific
attendance is now framed as pre-raid Signups rather than post-hoc
logging.

- Raid Planner (available)
- Signups (available)
- Boss Rosters (available)
- Attendance (available)
- Bench Management (planned)
- Assignments (planned)
- Cooldown Planning (planned)
- Strategies (planned)
- Strategy Acknowledgements (planned)

Raid references Guild members and teams through explicit contracts; it
does not own the guild roster.

## Current source

- API: `modules/raid/api/planner`, `modules/raid/api/boss-rosters`,
  `modules/raid/api/signups`, `modules/raid/api/attendance`
- Web: `modules/raid/web/planner` (routed pages — Planner index +
  Event Detail) and `modules/raid/web/attendance` (routed page — the
  season rollup), `modules/raid/web/boss-rosters` and
  `modules/raid/web/signups` (components/hooks/types only, composed
  into the Event Detail page, no page/route of their own anymore)
- Shared: `modules/raid/shared/catalog/raidCatalog.ts` (Midnight raid
  instances by season, used by both API and web)

## Signups

The first genuinely self-service Raid feature, built 2026-08-14 after
the user pushed back that Raid Planner/Boss Rosters were far short of
WoWAudit/WoWUtils — their core differentiator is raiders signing
themselves up rather than an officer doing it for everyone. This is
the direct payoff of Guild's new `raider-link` capability (see
`modules/guild/README.md`): `RaidSignup` (real Prisma relation to
`RaidEvent`, cascade delete, like `RaidBoss`) has one row per
member per event with a status (`PRESENT`/`TENTATIVE`/`ABSENT`,
matching WoWUtils' own wording); a member with no row shows as
"not signed up" rather than any implicit default.

Two separate write paths land on the same table:

- **Self-service** (`PUT /raid/signups/events/:eventId/me`): gated by
  a raider-link bearer token, not `GuildVerificationGuard`.
  `RaidSignupService.setOwnSignup` resolves the token to a
  `GuildMember` via `GuildRaiderLinkService.getLinkedMember` (imported
  directly, Raid → Guild → Data Platform, the same dependency chain
  Boss Rosters already uses) and only ever writes that raider's own
  row — there's no `memberId` in the request body, so a raider cannot
  set anyone else's status even by accident.
- **Officer override** (`PUT /raid/signups/events/:eventId/members/:memberId`):
  gated by the existing `GuildVerificationGuard`, can set or clear any
  member's status, confirmed explicitly by the user ("der Raidlead
  kann den Status von jeder Anmeldung umsetzen").

The web page deliberately does **not** wrap the whole page in
`GuildVerificationGate` the way Boss Rosters/Planner do — those pages
are officer-only tools, but Signups' whole point is that regular
raiders use it too. Only the officer override grid is gated; the
event picker and the raider's own signup card stay outside the gate.

## Boss Rosters

`RaidBoss` belongs to a `RaidEvent` (real Prisma relation with
cascade delete, since both are Raid-owned — unlike the loose
`teamId` cross-module reference on `RaidEvent`). Each boss has
`RaidBossRosterEntry` rows, one per roster member with a status
(`CONFIRMED`/`TENTATIVE`/`BENCH`); a member only appears once an
officer has explicitly set a status — there is no implicit "everyone
unmarked is in". `memberId` stays a loose cross-module reference to
`GuildMember`, matching `RaidEvent.teamId`'s pattern; the service
enriches roster entries with member details (name, class, rank) by
querying Guild's roster repository directly rather than a Prisma
join. Mutations reuse the same `GuildVerificationGuard` as the rest
of Raid and Guild; reading stays open.

The boss list for the selected raid event renders as a visual card
grid (`BossList.tsx`) rather than a plain list, matching WoWUtils'
card-based CD Notes/Setups screens — each card shows the boss name
and CONFIRMED/TENTATIVE/BENCH counts. Grouping stays scoped to the
single selected `RaidEvent`, since a `RaidBoss` always belongs to
exactly one raid instance+difficulty; a cross-event view spanning
multiple raid tiers was considered but deferred as a larger, separate
feature (would need a new aggregation API, not just a restyle).

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

The overview panel has a Calendar/List toggle (`RaidCalendarView.tsx`,
defaults to Calendar), matching WoWAudit's Events page — a fixed 6x7
Monday-first month grid (`modules/raid/web/planner/utils/calendarMonth.ts`)
with events rendered as small cards color-coded by difficulty
(left-border accent). Clicking an empty day prefills the existing
create form with that date at a default 20:00 start time
(`RaidEventForm`'s `prefillDate` prop) rather than opening a separate
flow — reuses the exact same form/validation/submit path as manual
creation, just seeds the date field. Clicking an event card (Calendar
view) or an event row (List view) navigates to that event's detail
page rather than opening inline edit.

## Event Detail Page (Planner + Boss Rosters + Signups consolidation)

Built 2026-08-14 after the user shared six more WoWAudit screenshots
proving WoWAudit has **no** separate Boss Rosters or Signups tabs at
all — one `Events` tab, and clicking an event opens a single detail
page showing the raider's own signup status, the attendance count,
and the roster setup together. SynTrack made you pick "which raid?"
independently on three separate pages
(`/raid/planner`, `/raid/boss-rosters`, `/raid/signups`) to look at
the same event from three angles — that was the "workflow ist nicht
so schlau" complaint.

The fix is navigational, not a data-model change: `RaidBoss` +
`RaidBossRosterEntry` (per-boss roster granularity, more granular
than WoWAudit's single roster-wide "Setup") is deliberately kept —
still the right model, no reason to throw it away. `BossRostersPage`
and `SignupsPage` are deleted along with their routes and nav
entries; their `api`/`components`/`hooks`/`types` folders stay and
are composed, unchanged, into the new
`modules/raid/web/planner/pages/RaidEventDetailPage.tsx` at route
`/raid/planner/:eventId`: header (title/instance/difficulty/time,
Edit/Delete gated behind `GuildVerificationGate`) → `MySignupCard`
(ungated, self-service) → boss list + `BossRosterGrid` (gated
mutations, open reads, same as before) → officer signup overview
grid (`SignupOfficerGrid`, gated). No new backend endpoints — every
piece already read by `eventId`; this is a pure frontend
recomposition. `RaidPlannerPage` (`/raid/planner`) itself simplifies
to create-only (the calendar-day-prefill flow stays) plus the
Calendar/List overview, since editing/deleting an existing event now
lives entirely on its detail page — `RaidEventList` dropped its own
Delete column for the same reason.

## Raid attendance

Migrated 2026-08-14 from a standalone `GuildAttendanceEvent`/
`GuildAttendanceRecord` model to `RaidAttendanceRecord`, a loose
per-member status row (`PRESENT`/`LATE`/`EXCUSED`/`ABSENT`) scoped to
the same `RaidEvent` the Planner already creates — closing the
duplication the user flagged directly: "Attendance erstellt aktuell
noch eigene Guild-Attendance-Events, obwohl es dieselben Raidnächte
bereits als RaidEvent gibt". There is no second event model and no
separate event-creation workflow for attendance; `GuildMember` is
referenced loosely by id, matching `RaidBossRosterEntry`/`RaidSignup`.

Recording status per member happens on the Event Detail page
(`RaidAttendanceSection.tsx`, gated behind `GuildVerificationGate`,
same officer-only mutation pattern as Boss Rosters and the Signups
override grid). The `/raid/attendance` page itself is a **read-only,
season-filtered roster rollup** — Present/Late/Excused/Absent counts
and an attendance % per member, aggregated across every `RaidEvent`
in the selected season — not an event picker. This was an explicit
correction from the user after seeing the first version (an
event-list-then-per-event-grid page, mirroring the old Guild
Attendance UI): "select event ist auch nicht so schlau. Lieber nen
Filter default ist die ganze Season auflisten. Eigentlich so wie im
audit Screenshot" (referencing WoWAudit's Events → Event insights
view — season filter + one aggregate table, no per-event picker as
the landing view). The season filter reuses
`modules/raid/shared/catalog/raidCatalog.ts`'s season date ranges,
defaulting to whichever season contains today's date.

## Raid content catalog

Known Midnight raid instances, with their real encounter lists
(researched 2026-08-14, not guessed — see sources in the
`project_wowaudit_reference` memory), live in
`modules/raid/shared/catalog/raidCatalog.ts` (season, name,
`availableFrom` date, `bosses: {name, sortOrder}[]`).
`RaidEventForm` uses `getRaidsForScheduledAt` to turn "raid instance"
into a dropdown scoped to whatever's live on the picked date, so
officers no longer type the raid name by hand.

`RaidPlannerService.create` looks up the picked `raidInstance` via
`findRaidByName` right after creating the `RaidEvent` and, if it
matches a catalog raid, creates all of that raid's `RaidBoss` rows
immediately (reusing `RaidBossRosterRepository.createBoss` — Planner
and Boss Rosters are both Raid-owned, so this is an in-module
dependency, not a cross-module one). This closed a direct complaint:
"das wir Bosse noch anlegen müssen [ist] umständlich" (having to
still manually add bosses is cumbersome) — for any catalog raid,
Boss Rosters now opens pre-populated; the manual "Add boss" form
stays only as a fallback for content outside the catalog (old-tier
runs, custom trials). This only fires on event creation, not on
edit — changing `raidInstance` on an existing event does not
retroactively reseed bosses.

## Demo data

`apps/api/prisma/seed-demo-guild.ts` (run via `npm run
seed:demo-guild`) seeds a persistent, idempotent demo guild —
18 `GuildMember` rows on realm "Draenor" (a WoWAudit reference guild
the user pointed at, kept separate from any real verified guild's
realm so it can never collide with real data), a "Team Main"
`GuildTeam`, a few `GuildRequirement`s, two `GuildOfficerNote`s, and
two `RaidEvent`s (one past, fully populated with signups/boss
roster/attendance; one upcoming, signups only) built via
`findRaidByName` the same way `RaidPlannerService.create` does. Built
so there's always something to look at without seeding-then-deleting
scratch data by hand for every manual test pass; safe to re-run
(upserts on natural keys, skips raid events that already exist by
title).