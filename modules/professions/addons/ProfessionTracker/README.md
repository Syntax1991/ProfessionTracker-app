# ProfessionTracker compatibility shim

This addon contains no profession logic. It loads the historical
`ProfessionTracker.lua` SavedVariables file before
`SynTrack_Professions` starts.

During the migration release, both addon manifests declare
`ProfessionTrackerDB`. On logout or `/reload`, WoW therefore writes
the current database into the new `SynTrack_Professions.lua` file as
well.

Do not add business logic to this directory. Once the migration window
has ended, this shim and the dependency from `SynTrack_Professions`
can be removed in a dedicated release.
