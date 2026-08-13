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

- API: `modules/guild/api/roster`, `modules/guild/api/roster-import`
- Web: `modules/guild/web/roster`
- Addon: `modules/guild/addons/SynTrack_Guild`

Roster members can be managed manually or synced from the
`SynTrack_Guild` WoW addon via the roster-import endpoints. The raw
WoW officer note captured by the addon lives on `GuildMember`; the
richer Officer Notes capability (freeform, timestamped officer
commentary) is a separate future addition.
