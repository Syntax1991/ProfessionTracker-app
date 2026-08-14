# Guild

Guild organization and persistent guild state.

## Capabilities

All seven originally planned capabilities are implemented, plus a
Gear Audit added afterward as a deliberate WoWAudit-inspired
extension (see below):

- Dashboard (available)
- Roster (available)
- Gear Audit (available)
- Teams (available)
- guild-level Attendance (available)
- Weekly Progress (available)
- Requirements (available)
- Officer Notes (available)

## Current source

- API: `modules/guild/api/roster`, `modules/guild/api/roster-import`,
  `modules/guild/api/verification`, `modules/guild/api/teams`,
  `modules/guild/api/requirements`, `modules/guild/api/officer-notes`,
  `modules/guild/api/attendance`, `modules/guild/api/weekly-progress`,
  `modules/guild/api/audit`
- Web: `modules/guild/web/roster`, `modules/guild/web/verification`,
  `modules/guild/web/teams`, `modules/guild/web/requirements`,
  `modules/guild/web/officer-notes`, `modules/guild/web/attendance`,
  `modules/guild/web/weekly-progress`, `modules/guild/web/dashboard`,
  `modules/guild/web/audit`
- Addon: `modules/guild/addons/SynTrack_Guild`

Roster members can be managed manually or synced from the
`SynTrack_Guild` WoW addon via the roster-import endpoints. The raw
WoW officer note captured by the addon lives on `GuildMember`; the
richer Officer Notes capability (freeform, timestamped officer
commentary, see below) is a separate feature.

## Guild leadership verification

Roster, team, requirement, officer-note and attendance mutations
(create, update, delete, addon import, membership/record changes)
require a verified guild leadership link. Reading stays open
everywhere. Verification works entirely through Blizzard's official
APIs, reusing the existing Battle.net OAuth connection
(`modules/data-platform/api/integrations/battlenet`):

1. The connected Battle.net account's own characters are checked
   against Blizzard's Character Profile API for guild membership —
   no guild name has to be typed or guessed, since Blizzard does not
   support guild search.
2. The chosen character's rank is looked up in Blizzard's official
   Guild Roster API.
3. Rank `0` is always the Guild Master. Blizzard does not expose
   custom rank titles (e.g. "Officer") at all, so ranks `0`-`2` are
   treated as guild leadership by a fixed server-side policy
   (`LEADERSHIP_RANK_THRESHOLD` in
   `modules/guild/api/verification/verification.service.ts`). This
   threshold is intentionally not a client-supplied parameter —
   accepting it from the request would make the check meaningless.
4. A successful verification is persisted as a singleton
   `GuildVerification` record. Every mutating service
   (`GuildRosterService`, `GuildRosterImportService`,
   `GuildTeamService`, `GuildRequirementService`,
   `GuildOfficerNoteService`, `GuildAttendanceService`) calls the
   shared `GuildVerificationGuard.ensureVerified()` before mutating
   and rejects with `403` otherwise. On the web, every mutating page
   is wrapped in the shared `GuildVerificationGate` component, which
   shows the candidate picker until verified and the status card
   afterward.

Known limitation: because Blizzard never returns rank names, a real
officer placed below rank `2` will not pass verification until the
threshold is revisited. There is currently no UI to change the
threshold per guild; adjust the constant if a guild's conventions
differ.

## Roster

`GuildMember.role` (`TANK`/`HEALER`/`MELEE`/`RANGED`, nullable) is a
manually officer-set field — WoW exposes no reliable read API for a
character's actual raid role without deep spec/talent inspection, so
this follows the same pattern as `rank`: an officer sets it by hand
rather than SynTrack guessing wrong. The Roster page groups members
into role sections (Tanks/Healers/Melee DPS/Ranged DPS/Unassigned,
`modules/guild/web/roster/components/RosterRoleGroups.tsx`) and adds
a "Raid Summary" sidebar (`RosterSummarySidebar.tsx`) showing role
composition, guild-wide average item level (from the Gear Audit
fields), and an armor-type breakdown derived from each member's class
name (`modules/guild/web/roster/utils/rosterRoles.ts`). This restyle
follows the WoWUtils Group Hub → Roster screen directly (see the
`project_wowaudit_reference` memory).

## Teams

Teams (`GuildTeam` + `GuildTeamMembership`) group existing roster
members into persistent units — e.g. a Mythic core team or a second
Heroic team — independent of any specific raid event. A member can
belong to multiple teams; each membership carries a `role`
(`MEMBER`, `SUBSTITUTE`, `LEAD`). Teams only reference roster members
by ID, so deleting a `GuildMember` cascades and removes their team
memberships too. A boss-specific raid roster built from a team
belongs to the Raid module, not here.

## Gear Audit

Inspired directly by WoWAudit's core feature (added 2026-08-14 after
explicit user feedback to model SynTrack's guild tooling on WoWAudit
and WoWUtils — see the `project_wowaudit_reference` memory for the
full context). `GuildMember` carries five nullable audit fields
(`averageItemLevel`, `missingEnchantSlots`, `totalSocketCount`,
`filledSocketCount`, `auditedAt`) populated by
`POST /guild/audit/refresh` (verification-gated): it pulls every
roster member's live equipped gear from Blizzard's Character
Equipment Summary API (via the verified officer's Battle.net
connection) and computes the stats in
`modules/guild/api/audit/audit.stats.ts`.

Unlike Weekly Progress, this does **not** require a matching My
SynTrack `Character` — it works directly off the roster's own
`name`/`realm`, covering every member regardless of whether they're
separately tracked. The catch: `GuildMember.realm` only stores a
realm *display name*, never a Blizzard realm *slug*, so
`audit.realm-slug.ts` derives the slug with a lowercase/hyphenate
heuristic (`slugifyRealmName`). This resolves correctly for the vast
majority of realms but can miss ones with unusual characters — those
members are silently skipped (counted in `skippedMembers`) rather
than failing the whole refresh.

The enchantable-slot list intentionally excludes head/shoulder, since
whether those carry an enchant depends on expansion-specific systems
(renown, crests, ...) that come and go; including them risked false
"missing enchant" flags.

## Requirements

`GuildRequirement` is a list of expectations the guild sets for its
members (title, description, category —
`GEAR`/`KEYSTONE`/`ATTENDANCE`/`PROFESSION`/`OTHER`). A `GEAR`
requirement may additionally set `minimumItemLevel`; when it does,
the Requirements page cross-references it against every roster
member's `averageItemLevel` from the Gear Audit and shows a live
pass/fail count plus the names below threshold. Requirements in the
other categories (Keystone, Attendance, Profession, Other) remain
plain documentation — there's no automated compliance source for
those yet.

## Officer Notes

`GuildOfficerNote` holds freeform, timestamped commentary per guild
member, distinct from the single raw WoW officer note field captured
by the addon on `GuildMember.officerNote`. Every note is stamped with
the verified officer's character name server-side
(`GuildOfficerNoteService.create` reads it from
`GuildVerificationService.getStatus()`) — the author is never taken
from client input, so notes can't be attributed to someone who didn't
actually create them.

## Attendance

`GuildAttendanceEvent` (a raid night) has many
`GuildAttendanceRecord` entries (one per member who was tracked,
status `PRESENT`/`LATE`/`EXCUSED`/`ABSENT`). Only members with an
explicit record for an event count toward that event; there's no
implicit "everyone not marked is absent". The per-member attendance
percentage shown on the Attendance page is computed client-side from
all events: `EXCUSED` records count toward neither attended nor
missed, so a sanctioned absence doesn't hurt the percentage, while
`LATE` counts the same as `PRESENT`. The record grid has a "mark all
as" bulk action per status so taking attendance for a full roster
doesn't require clicking every member individually.

## Weekly Progress

Read-only cross-reference between the guild roster and My SynTrack's
per-character weekly data (`modules/my-syntrack/api/weekly-checklist`,
`modules/my-syntrack/api/vault-mythic-plus`). For each `GuildMember`,
`GuildWeeklyProgressService` looks for a `Character` with the exact
same `name`/`realm`/`region` and, if found, reports that character's
weekly checklist completion count and Mythic+ run count for the
current reset period (via the shared `getWeeklyPeriod()` helper).
Members without a matching `Character` show as "not tracked" — this
is an identity match, not an integration, so inconsistent naming
between the roster and My SynTrack breaks the link silently.

## Dashboard

`/guild` composes read models from every other capability (roster
count, team count, event count, tracked-member count, requirement
count, officer-note count, verification status) into summary cards
purely in the frontend — there is no dedicated dashboard API
endpoint beyond the existing list endpoints plus
`GET /guild/officer-notes/count`.
