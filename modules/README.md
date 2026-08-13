# SynTrack Main Modules

This directory contains SynTrack's business modules. Each child
directory owns its API, web and addon code instead of spreading one
feature across global backend and frontend feature trees.

Module source uses these optional subdirectories:

- `api`: backend controllers, services, repositories and contracts
- `web`: frontend pages, components, hooks, API clients and models
- `addons`: module-owned WoW addons
- `README.md`: ownership and dependency rules

The deployable shells live in `apps/api` and `apps/web`. They compose
the modules but do not own module-specific business rules.

All modules currently share this Git repository. A separate repository
is justified only when a component needs an independent release cycle,
access boundary or ownership team.

| Module | Slug | State |
| --- | --- | --- |
| My SynTrack | `my-syntrack` | Implemented in part |
| Guild | `guild` | Planned |
| Raid | `raid` | Planned |
| Loot | `loot` | Planned |
| Professions | `professions` | Implemented in part |
| Recruitment | `recruitment` | Planned |
| Automation | `automation` | Planned |
| Data Platform | `data-platform` | Implemented in part |

Planned modules contain only a manifest until their first real
capability is implemented. This keeps the source tree explicit without
creating large empty skeletons.
