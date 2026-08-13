# Professions

Crafting and profession intelligence.

## Capabilities

- Crafter Finder
- Recipes
- Knowledge
- Specializations
- Material Quality
- Concentration
- Craft Recommendations

## Current source

- API: `modules/professions/api`
- Web: `modules/professions/web`
- WoW addon: `modules/professions/addons/SynTrack_Professions`

`modules/professions/addons/ProfessionTracker` remains as a
compatibility shim that carries the historical `ProfessionTrackerDB`
SavedVariables forward until the migration window ends. Additional
profession addons belong in this module's `addons` directory.

## Web workspaces

- Overview and profession drill-down
- Account-wide crafter finder
- Recipe catalog and craftability search
- Knowledge and skill coverage
- Character specialization editor
- Material-quality simulation
- Concentration opportunity finder
- Craft recommendations
