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
- Cooldown Planning (available — see below)
- Bench Management (planned)
- Assignments (planned)
- Strategies (planned)
- Strategy Acknowledgements (planned)

Raid references Guild members and teams through explicit contracts; it
does not own the guild roster.

## Current source

- API: `modules/raid/api/planner`, `modules/raid/api/boss-rosters`,
  `modules/raid/api/signups`, `modules/raid/api/attendance`,
  `modules/raid/api/cooldowns`
- Web: `modules/raid/web/planner` (routed pages — Planner index +
  Event Detail) and `modules/raid/web/attendance` (routed page — the
  season rollup), `modules/raid/web/boss-rosters` and
  `modules/raid/web/signups` (components/hooks/types only, composed
  into the Event Detail page, no page/route of their own),
  `modules/raid/web/cooldowns` (its own routed page,
  `/raid/cooldowns` — see below, not composed into Event Detail)
- Shared: `modules/raid/shared/catalog/raidCatalog.ts` (Midnight raid
  instances by season, used by both API and web)

## Cooldown Planning

### Step 1 — structured list (superseded by Step 2's timeline, kept as a fallback view)

Built 2026-08-14 after the user asked directly where "Raid Planner"
went (it hadn't — the nav label had just been renamed to "Events") and
then clarified what they actually meant: **"den Teil für Healing CDs
etc"** — Cooldown Planning, listed as "(planned)" in this file but not
even present in `raid.definition.ts`'s nav items. Chose "build it now"
as the next Raid slice.

Scoped deliberately smaller than the full WoWUtils-style interactive
timeline this file's own design note points at: `GuildMember` has no
spec field (only `className`), and fabricating a "which cooldown does
each spec have" reference table, or precise per-boss ability-cast
timing data, isn't something to guess at responsibly. `abilityName`
and `phaseLabel` on `RaidCooldownAssignment` are plain officer-typed
text (a `<datalist>` autocomplete suggests previously-typed ability
names across the event — real prior input, not fabricated data), not
gated to a fixed catalog. New same-module `RaidCooldownAssignment`
(real FK to `RaidBoss`, cascade delete, mirrors
`RaidBossRosterEntry`'s pattern; loose `memberId` cross-module
reference, same convention as `RaidBossRosterEntry.memberId`) — unlike
Boss Roster's one-entry-per-boss×member upsert, a character can hold
several assignments per boss (different moments), so this is plain
CRUD by id. Originally composed into the Event Detail page below
`BossRosterSection`; this composition was removed in Step 2 (see
below) — the table view itself (`CooldownBossPanel.tsx`) survives as
the "List" side of a Timeline/List toggle on the new dedicated page.

### Step 2 — dedicated page + real timeline (2026-08-14, same day)

Right after Step 1 shipped, the user pushed further on two points:
**"Guck dir an wie es bei WOWutils läuft wir brauchen eine
Möglichkeit über diese Timeline cds einzuplanen"** (look at how
WoWUtils does it, we need to plan CDs on that timeline) and
**"außerdem wollen wir ne extra Nav punkt dafür haben das gehört
jetzt nich direkt in den Anmeldungen etc"** (also we want a dedicated
nav entry, this doesn't belong inside the Event Detail page). Both
landed:

- **Dedicated page.** `<CooldownPlanSection>` removed entirely from
  `RaidEventDetailPage.tsx`. New `"Cooldowns"` nav item in
  `raid.definition.ts` → `CooldownsLandingPage.tsx` (`/raid/cooldowns`,
  its own route, not composed into any other page) — pick an event
  (reuses `RaidEventList`/`useRaidEvents`), pick a boss (tabs, reuses
  the shared `Tabs` component), see that boss's `BossCooldownView`
  (Timeline/List toggle wrapping the new `BossCooldownTimeline` and
  the kept `CooldownBossPanel` from Step 1).
- **Real timeline, honestly scoped.** I initially assumed no real
  per-boss ability/timing data could exist pre-launch and asked how to
  handle that — the user corrected this twice: **"es gibt ja schon
  daten aus PTR logs usw."** (PTR data already exists) and
  **"Außerdem ist der Patch schon da nur die Season startet erst
  nächste Woche"** (the patch/raid zone is already live, only the
  ranked Season starts next week). Re-researched properly: pulled real
  encounter data directly from **Blizzard's own Game Data API**
  (`journal-instance`/`journal-encounter` endpoints, app-level OAuth
  token via `BATTLENET_CLIENT_ID`/`SECRET` — more authoritative than
  scraping guide sites) for all 8 Venomous Abyss bosses. Landed in
  `modules/raid/shared/catalog/bossAbilityCatalog.ts` (same
  static-TS-catalog pattern as `raidCatalog.ts`/`lootCatalog.ts`):
  each boss's top-level named mechanics, deduped and grouped by the
  stage/phase title the encounter journal itself uses. Still
  deliberately **excludes exact cast timestamps** — the journal
  doesn't expose them, and even Method.gg's own PTR guide (cross-
  checked) states timers aren't confirmed pre-launch — so this is a
  read-only reference legend, not an auto-placed schedule.
  - `RaidBoss.fightDurationSeconds` (officer-set estimate, scales the
    axis) and new `RaidBossPhaseMarker` (officer-defined phase
    dividers) added alongside `RaidCooldownAssignment.timestampSeconds`
    (nullable — Step 1's phase-label-only rows keep working unchanged).
  - The timeline is hand-rolled CSS (`left: calc()` percentage
    positioning) — confirmed via research the repo has zero charting/
    timeline/drag-and-drop libraries and `RaidCalendarView`'s day-grid
    approach doesn't transfer to a continuous axis, so this needed
    genuinely new CSS (`cooldown-timeline.css`), not a new dependency.
    **Click-to-place, not drag-to-place** — clicking empty track space
    computes a timestamp from the click's X position and opens the
    same `CooldownAssignmentForm` used by the List view, pre-filled;
    existing markers are small class-colored chips, click-to-remove.
    (Superseded by Step 3 below: real per-ability rows, drag-to-
    reposition, and Warcraft-Logs-sourced boss timing.)
  - Live-tested end to end: set a 7:00 duration, added a phase marker
    at 1:42 (rendered at exactly 24.29% — 102/420), clicked the track
    at 50% (opened the form pre-filled "at 3:30"), placed and removed
    a marker, confirmed the List toggle shows the same assignment with
    its timestamp, confirmed the Event Detail page no longer shows any
    cooldown UI at all.

### Step 3 — real per-ability rows + Warcraft Logs sync (2026-08-15)

The user came back to this feature directly: **"das ist noch recht
unfertig... es ist noch keine richtige interaktive timeline vorhanden
mit Boss timer etc"** (still quite unfinished — no real interactive
timeline with a boss timer etc.). Verified the actual gap first rather
than guessing: Step 2's timeline was click-to-place on a **single
shared** boss track, with the real Blizzard-sourced ability names
(`bossAbilityCatalog.ts`) floating as a disconnected static legend
above the axis — nothing on the timeline showed *when* anything
happened. Re-researched WoWUtils' real "Viserio Cooldowns" tool
directly (the user pasted real screenshots of it): a dedicated row
**per boss ability** (each showing every real occurrence along the
fight) plus **one row per raider** below, not one shared track.

Rebuilt the interaction model to match:
- **One row per catalogued ability** (`TimelineGrid.tsx` loops
  `getAbilitiesForBoss(bossName)`), each showing that ability's own
  cast markers — `BossAbilityRow.tsx` per ability instead of one
  shared `BossAbilityRow` for everything.
- **One row per raider with ≥1 assignment** (`RaiderCooldownRow.tsx`),
  so overlapping cooldowns from different people no longer collide on
  a shared track; a "+ Add raider" select starts an empty row for
  someone new. Clicking a row pre-fills `CooldownAssignmentForm`'s
  character dropdown to that row (`initialMemberId` prop).
- **Drag-to-reposition** for placed raider cooldowns
  (`useMarkerDrag.ts` — a mousedown/mousemove/mouseup state machine
  distinguishing click (removes, unchanged from Step 2) from drag past
  a 4px threshold (repositions via the existing `PUT
  /raid/cooldowns/:assignmentId`, which already accepted
  `timestampSeconds` — no new backend endpoint needed for this part)).
- Phase dividers now span the **full grid height** across every row
  (`.cooldown-timeline-phase-overlay`, `position: absolute; inset: 0`
  over the whole row stack), not just one track.

**Then the user rejected officer-placed boss timing outright:
"wir pflegen die Daten nicht selber wann Boss z.B ability X macht auf
1:31"** (we don't maintain ourselves when boss ability X happens) —
they first said this data should come "von Blizzard selber." Re-
verified fresh (not from memory, per the project's standing
data-availability rule) via two web searches: Blizzard's Game Data/
Journal API has no per-encounter cast-timing data anywhere — that's
architectural, not a research gap, and it's exactly why Warcraft Logs
exists as a third-party service, and exactly what WoWUtils' own "WCL
Top Parses" feature (found earlier) is actually sourced from. Surfaced
this plainly; the user supplied a real Warcraft Logs API client
(`WARCRAFTLOGS_CLIENT_ID`/`SECRET` in `.env`/`env.ts`, same
`client_credentials` shape as `BATTLENET_CLIENT_ID`/`SECRET`) and
picked testing against a currently-logged encounter first, accepting
our actual target raid ("The Venomous Abyss") shows nothing until real
kills exist (Season 2 starts 2026-08-19 — WCL's own zone list doesn't
have this raid yet, confirmed live against the API).

**Boss ability rows are now fully Warcraft-Logs-sourced, not officer-
editable** — `BossAbilityRow.tsx` is read-only (no click handler).
A **"Sync from Warcraft Logs"** button
(`modules/raid/api/cooldowns/warcraftlogs.{client,transport,types}.ts`,
`RaidCooldownService.syncBossFromWarcraftLogs`, `POST
/raid/cooldowns/bosses/:bossId/sync-wcl`) does, per boss, in one real
GraphQL pipeline verified directly against the live API before
building anything:
1. `worldData.zones(expansion_id: 7)` (7 = "Midnight", current season
   — matches this project's scope, same as `raidCatalog.ts`) — find
   the encounter by exact name match. 404 with a clear German message
   if the boss isn't logged on WCL yet.
2. `worldData.encounter(id).characterRankings(metric: hps)` — take the
   #1 ranked real kill's `report.code`/`fightID`.
3. `reportData.report(code).fights(fightIDs)` for real `startTime`/
   `endTime`; `masterData.actors(type:"NPC")` filtered to
   `subType:"Boss"` + matching name to find the boss's own actor id.
4. `report.events(dataType:Casts, hostilityType:Enemies, sourceID:
   <bossActorId>, startTime/endTime)` (paginated via
   `nextPageTimestamp`) for real cast events — `timestamp -
   fight.startTime` is the real in-fight second.
5. One aliased `gameData` query resolves all unique `abilityGameID`s
   to real names in a single HTTP call.
6. Cross-references extracted names against
   `getAbilitiesForBoss(bossName)` (only real catalogued abilities
   survive — same principle as Loot Wishlist/Droptimizer's "only real,
   catalogued data"), then atomically (one `$transaction`) replaces
   all `RaidBossAbilityCast` rows for the boss and updates
   `RaidBoss.fightDurationSeconds`/`wclReportCode`/`wclFightId`/
   `wclSyncedAt` with the real synced values — a successful sync
   overwrites any manually-set duration, same "real data wins" pattern
   as `lootCatalog.ts`'s API rebuild superseding its scraped
   predecessor. Manual duration entry stays as a fallback for bosses
   with no WCL data yet.

Live-tested the full pipeline end-to-end through the real service code
(not just the raw API): temporarily renamed a seeded test boss to
"Imperator Averzian" (a currently-logged encounter — our real Venomous
Abyss bosses have no logs yet) and added one temp catalog ability to
prove the cross-reference filter, synced, confirmed a real fight
duration (157s), real report code/fight id, and real cast markers
(e.g. "Dark Upheaval" at 0:06/0:55/1:31) rendered on their own row at
the correct axis position — reverted the boss name, catalog entry, and
synced data afterward. Confirmed the honest failure path separately on
a real Venomous Abyss boss: clean 404 "Für diesen Boss gibt es noch
keine Logs auf Warcraft Logs," nothing crashes.

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

**Redesigned 2026-08-14 as a unified matrix** (`BossRosterMatrix.tsx`,
replacing the old `BossList.tsx`/`BossRosterGrid.tsx` pick-one-boss
flow), after the user pointed at WoWAudit's real event page ("die
event detail page ist noch echt unclean guck dir mal an wie audit das
macht"). WoWAudit shows every boss as a column and the whole
role-grouped roster as rows in one table — SynTrack's old layout made
you select one boss from a side list to see its roster at all, which
was the actual "unclean" complaint. The matrix reuses Guild's
`ROLE_ORDER`/`ROLE_LABELS`/`resolveRoleKey` (same role grouping as the
Roster page) for row grouping, one column per `RaidBoss`, and a cell
per member×boss showing `RaidBossRosterEntry.status` (✓/?/B/–).
Clicking a cell cycles unset→CONFIRMED→TENTATIVE→BENCH→unset in
place — no per-status button row per cell, which wouldn't fit next to
more than one or two boss columns. Boss add/delete moved from a
side-by-side panel into an inline "+ Add boss" toggle above the table
and a small "×" in each column header. No backend or data-model
change — same `RaidBoss`/`RaidBossRosterEntry` reads/writes as
before, purely a frontend recomposition.

Restyled twice more the same day chasing further WoWAudit screenshots
("nicht nur Text... sondern so aufgebaut", "die Funktionen haben wir
ja nur das View muss noch schön gemacht werden" — same functionality,
just needed to look right). Member cells get a small avatar
(`BossMatrixMemberCell.tsx`) with a class-colored ring
(`modules/guild/web/roster/utils/classColors.ts`, the standard WoW
class palette — new, nothing else in the app had a class→color
mapping yet) instead of a bare name, and status cells render as a
full-width colored bar filling the cell (`.boss-matrix-bar`) rather
than a small centered badge.

**Then a further clarifying screenshot resolved the earlier
role-columns-vs-boss-columns tension properly**: WoWAudit's default
"Setup" view (what you see landing on an event) is a simpler
role-column Selected/Benched summary — the per-boss colored-bar grid
only appears once you drill in further. `BossRosterSection.tsx` now
toggles between two views: **Overview** (default) —
`BossRosterOverview.tsx`, four role columns (reusing
`ROLE_ORDER`/`ROLE_LABELS`), each member sorted into "Selected"
(signed up `PRESENT`) or "Benched" (anything else) with a
✓/✕ badge — sourced from `RaidSignup`, not per-boss data, per
explicit confirmation ("inkl. Signup status in dem overview als Haken
X"). **Edit** — the existing boss-columns matrix, for the actual
per-boss `RaidBossRosterEntry` assignment work. No new backend calls;
Overview reuses the same `entries` the Signups section already
fetches.

**Matrix cells now show signup-derived defaults.** A fully-signed-up
event otherwise opened the Edit matrix completely blank for every
boss, since `RaidBossRosterEntry` is a separate, officer-driven data
set that starts empty regardless of signups — the user pointed at an
event with everyone signed up Present next to its empty matrix:
"dort sollten schon gespeicherte Werte erscheinen falls Tank z.B
eingeplant ist etc.." and clarified further that this means the
**Edit/matrix view** specifically, not just the Overview: "Tank ist
alle Bosse eingeplant also sollte man in der Boss Ansicht dann auch
sehen, wo der Char schon confirmed, Bench etc ist." `BossRosterMatrix`
now takes the same `signupEntries` prop as `BossRosterOverview` and,
for any cell with no explicit `RaidBossRosterEntry`, displays a
**suggested CONFIRMED** bar (dashed/dimmed via `.boss-matrix-bar
.suggested`, with a tooltip explaining it's not yet confirmed for
that specific boss) when the member is signed up `PRESENT` — purely a
display default, never auto-persisted. Clicking a suggested cell
starts the cycle from its displayed CONFIRMED value (moving to
TENTATIVE next) and, once clicked, becomes a real persisted
`RaidBossRosterEntry` like any other cell; clearing it back to unset
falls back to showing the suggested default again rather than a truly
empty cell, since the underlying signup hasn't changed. This keeps
Signups and the per-boss roster as two intentionally separate data
sets (extracted into `BossMatrixStatusCell.tsx` to stay under the
350-line file limit) while giving officers a sensible starting point
instead of re-deciding from scratch per boss for someone already
known to be present.

Event Edit/Delete moved from a separate "MANAGE" panel into a plain
button row directly under the page header (`RaidEventActionsBar.tsx`)
to match WoWAudit's inline header-button pattern, rather than a boxed
panel.

**Decluttered further** ("Officer overview kann raus und attendance
auch ebenfalls die Anzeige von Syngold und 'finish linking your
character'") — `MySignupCard`, the guild-verification status card,
`SignupOfficerSection` and `RaidAttendanceSection` no longer render
on this page. The status-card removal was a one-off `hideStatusCard`
prop on `GuildVerificationGate` at first; a later pass (same day, see
Guild's README "Settings" section) removed the card from
`GuildVerificationGate` entirely and gave it a single home on the new
`GuildSettingsPage` instead, so the prop is gone too — this page's
`<GuildVerificationGate>` call takes no extra props now, same as
every other gated page. `MySignupCard.tsx`, `SignupOfficerGrid.tsx`,
and the per-event `useEventAttendance` hook are kept (not deleted) —
they're unused right now, not confirmed dead: self-service signup and
per-event attendance recording are still real, working features, just
not currently composed onto this page. If they should come back (a
leaner "My status" line, attendance recording elsewhere) or be
removed for good, that needs its own
decision, not a default from decluttering this one page.

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
`/raid/planner/:eventId`: header, self-service `MySignupCard`
(ungated), a boss roster section (gated mutations, open reads — see
"Boss Rosters" below for the later matrix redesign), and an officer
signup overview grid (`SignupOfficerGrid`, gated). No new backend
endpoints — every
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