# SynTrack Guild

WoW addon that captures the guild roster (name, class, level, rank
and notes) for the SynTrack guild management platform.

## SavedVariables

`SynTrack_GuildDB` is captured automatically on `GUILD_ROSTER_UPDATE`
and `PLAYER_GUILD_UPDATE`, and on demand via `/stguild capture`.
Import the file into the SynTrack web app under Guild → Roster to
sync it into the guild database.

## Commands

- `/stguild status` — show the addon version and the last captured
  roster size
- `/stguild capture` — request a roster refresh from the server and
  capture whatever is currently cached

## Core integration

Registers itself with `SynTrack_Core` (optional dependency) as the
`guild` module for status visibility only. The roster payload itself
is transported through its own `SynTrack_GuildDB` SavedVariables and
the dedicated Guild roster-import API, not through Core's generic
module capture payload.
