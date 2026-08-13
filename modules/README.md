# SynTrack Main Modules

This directory contains SynTrack's business modules. Each child
directory owns its API, web and addon code instead of spreading one
feature across global backend and frontend feature trees.

Every main module has the same stable top-level contract:

- `README.md`: ownership and dependency rules
- `addons`: permanent home for module-owned WoW addons

The following source directories are added when the module gains the
corresponding runtime capability:

- `api`: backend controllers, services, repositories and contracts
- `web`: frontend pages, components, hooks, API clients and models

An addon is always placed in its own technical subdirectory:

```text
modules/<main-module>/addons/<AddonName>
```

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

Planned modules keep their ownership README and an `addons/README.md`.
Empty `api` and `web` skeletons are added only with the first real
capability, while the addon boundary remains visible from day one.
