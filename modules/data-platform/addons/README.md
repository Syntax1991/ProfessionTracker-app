# Data Platform Addons

WoW addons whose primary responsibility is shared data capture,
transport or synchronization belong here.

Each addon uses its own technical directory:

```text
modules/data-platform/addons/<AddonName>
```

`SynTrack_Core` owns shared character identity, module registration,
the addon event bus and the general SavedVariables transport contract.
It does not own domain-specific capture logic.

Domain-specific addons remain in their owning business module even
when they use Data Platform import contracts.
