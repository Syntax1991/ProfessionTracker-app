# Guild

Guild organization and persistent guild state.

## Capabilities

- Dashboard (planned)
- Roster (available)
- Teams (planned)
- guild-level Attendance (planned)
- Weekly Progress (planned)
- Requirements (planned)
- Officer Notes (planned)

## Current source

- API: `modules/guild/api/roster`, `modules/guild/api/roster-import`,
  `modules/guild/api/verification`
- Web: `modules/guild/web/roster`, `modules/guild/web/verification`
- Addon: `modules/guild/addons/SynTrack_Guild`

Roster members can be managed manually or synced from the
`SynTrack_Guild` WoW addon via the roster-import endpoints. The raw
WoW officer note captured by the addon lives on `GuildMember`; the
richer Officer Notes capability (freeform, timestamped officer
commentary) is a separate future addition.

## Guild leadership verification

Roster mutations (create, update, delete, addon import) require a
verified guild leadership link. Verification works entirely through
Blizzard's official APIs, reusing the existing Battle.net OAuth
connection (`modules/data-platform/api/integrations/battlenet`):

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
   `GuildVerification` record. `GuildRosterService` and
   `GuildRosterImportService` call `ensureVerified()` before any
   mutation and reject with `403` otherwise. Reading the roster
   remains open.

Known limitation: because Blizzard never returns rank names, a real
officer placed below rank `2` will not pass verification until the
threshold is revisited. There is currently no UI to change the
threshold per guild; adjust the constant if a guild's conventions
differ.
