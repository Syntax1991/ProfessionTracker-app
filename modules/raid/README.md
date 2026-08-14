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
- Bench Management (planned)
- Assignments (planned)
- Cooldown Planning (planned)
- Strategies (planned)
- Strategy Acknowledgements (planned)

Raid references Guild members and teams through explicit contracts; it
does not own the guild roster.

## Current source

- API: `modules/raid/api/planner`, `modules/raid/api/boss-rosters`,
  `modules/raid/api/signups`
- Web: `modules/raid/web/planner`, `modules/raid/web/boss-rosters`,
  `modules/raid/web/signups`

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
