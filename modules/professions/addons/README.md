# Professions Addons

WoW addons for profession and crafting capabilities belong here.

Each addon uses its own technical directory. The current addon is:

```text
modules/professions/addons/SynTrack_Professions
```

`modules/professions/addons/ProfessionTracker` remains as a
compatibility shim that only carries the historical `ProfessionTrackerDB`
SavedVariables forward during the migration window. It contains no
profession logic and will be removed in a dedicated release once the
migration is complete.
