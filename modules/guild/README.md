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
- Weekly Progress (available)
- Requirements (available)
- Officer Notes (available)

## Current source

- API: `modules/guild/api/roster`, `modules/guild/api/roster-import`,
  `modules/guild/api/verification`, `modules/guild/api/teams`,
  `modules/guild/api/requirements`, `modules/guild/api/officer-notes`,
  `modules/guild/api/weekly-progress`,
  `modules/guild/api/audit`
- Web: `modules/guild/web/roster`, `modules/guild/web/verification`,
  `modules/guild/web/teams`, `modules/guild/web/requirements`,
  `modules/guild/web/officer-notes`,
  `modules/guild/web/weekly-progress`, `modules/guild/web/dashboard`,
  `modules/guild/web/audit`
- Addon: `modules/guild/addons/SynTrack_Guild`

Roster members can be managed manually or synced from the
`SynTrack_Guild` WoW addon via the roster-import endpoints. The raw
WoW officer note captured by the addon lives on `GuildMember`; the
richer Officer Notes capability (freeform, timestamped officer
commentary, see below) is a separate feature.

## Guild leadership verification

Roster, team, requirement and officer-note mutations
(create, update, delete, addon import, membership/record changes)
require a verified guild leadership link. Reading stays open
everywhere. Verification works entirely through Blizzard's official
APIs, using whichever `RaiderAccount` is currently signed in via Data
Platform's unified Raider Login
(`modules/data-platform/api/raider-auth`) — `GuildVerificationService`
resolves a live Blizzard access token per-request via
`RaiderAuthService.requireUsableAccessToken(token)`, not a shared
connection. (Until 2026-08-14 this reused a single app-owner-only
`BattleNetConnection`; that flow was retired when the user asked for
one login protecting the whole app instead of two parallel ones — see
the `project_raider_login` memory.)

1. The signed-in account's own characters are checked against
   Blizzard's Character Profile API for guild membership — this is
   the default discovery path since Blizzard doesn't support
   free-text guild *search*. Added 2026-08-14 after a WoWUtils
   screenshot ("Link Guild" by Region/Realm/Name): a second path,
   `POST /guild/verification/lookup`
   (`GuildVerificationService.lookupGuild`), looks up an exact
   realm+guild name directly via Blizzard's Guild Roster API —
   Blizzard *does* support this exact-name lookup, just not
   discovery/search — then filters that guild's roster down to the
   signed-in account's own characters. Same security model either
   way: whichever path is used, you still pick one of *your own*
   characters as proof in the next step, never someone else's.
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
   `GuildOfficerNoteService`) calls the
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

## Raider Login (self-service linking)

`modules/guild/api/raider-link` lets a raider who signed in via Data
Platform's `raider-auth` (see `modules/data-platform/README.md`) claim
their own `GuildMember` roster entry — `GuildMember.linkedRaiderAccountId`
is a loose reference into Data Platform's `RaiderAccount`, following
the same cross-module convention as `RaidEvent.teamId`. This is
**not** gated by `GuildVerificationGuard`: a raider can only claim a
member whose name+realm is actually among the WoW characters on
*their own* Battle.net account (checked against the session's
character snapshot), which is self-authenticating without needing
officer approval.

`POST /guild/raider-link/resolve` matches the signed-in account's
characters against the roster by name+realm (region is implicitly
`env.BATTLENET_REGION`, since the whole app is single-region):
exactly one match auto-links; more than one returns a candidate list
for the raider to pick from (alts); zero matches means none of their
characters are on the roster yet. `POST /guild/raider-link/claim`
finalizes a pick and rejects both an unowned character and a member
already linked to a different account. `GET /guild/raider-link/me`
returns the current link, or `null`.

This is a prerequisite for self-service raid Signups (Raid module,
not yet built) — the next step needing "who is submitting this" now
has an answer that doesn't require the officer to act on every
raider's behalf. Added 2026-08-14 after direct user feedback that the
Raid Planner/Boss Rosters were far short of WoWAudit/WoWUtils, whose
core differentiator is exactly this kind of self-service (see the
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
Equipment Summary API — using whichever `RaiderAccount` triggers the
refresh, via the same `requireUsableAccessToken` guard verification
uses — and computes the stats in
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
