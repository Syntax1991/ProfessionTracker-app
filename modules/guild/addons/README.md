# Guild Addons

WoW addons for guild-side roster, team and attendance capabilities
belong here.

Each addon uses its own technical directory:

```text
modules/guild/addons/<AddonName>
```

## Current addon

- `modules/guild/addons/SynTrack_Guild` — captures the guild roster
  (name, class, level, rank, notes) and registers itself with
  `SynTrack_Core`.

Future Teams and Attendance capabilities may extend this addon or add
their own technical directory here without mixing source files.
