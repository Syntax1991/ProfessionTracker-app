# Loot

Loot planning and distribution.

## Capabilities

- Loot Table (built 2026-08-14 — see below)
- Wishlist (planned, next)
- Droptimizer (planned, next)
- Loot Council (planned)
- Loot History (planned)
- Tier / Token Planning (planned)
- Split Planning (planned)

Loot references Raid events and Guild members through stable contracts.

## Loot Table (Step 1 of the WoWAudit-derived roadmap)

Built 2026-08-14 after the user shared eight WoWAudit Loot screenshots
and asked directly for two things: **"infos über loot tables etc wo
was droppt"** (info on loot tables — where things drop) and **"die
Möglichkeit sims hochladen"** (the ability to upload sims). Given the
module had zero code beforehand (nav placeholder only) and the second
ask needs an unverified external API (Raidbots' Droptimizer report
format couldn't be confirmed from documentation), this was scoped as
the first of three steps — matching the "one vertical slice" pattern
already used for Raid's 7-capability rollout and Guild's 12-tab
WoWAudit-derived Roster/Gear-Audit merge.

`modules/loot/shared/catalog/lootCatalog.ts` holds Midnight Season 2's
raid ("The Venomous Abyss") loot table as real, researched data — not
guessed — cross-checked against two independent sources (an
expcarry.com loot-table breakdown and the user's own WoWAudit
screenshots of the same raid, which confirmed most item→slot→boss
assignments directly). Follows the same "static catalog, no DB table"
pattern as `modules/raid/shared/catalog/raidCatalog.ts`: this is
reference data, not per-guild interactive state, so it doesn't need a
migration. Item `slot` values match Blizzard's real equipped-item
vocabulary (`enchantableSlotTypes` in
`modules/guild/api/audit/audit.stats.ts`). Tier-token items carry a
`tierSlot` (which of the five tier slots they represent); Ula'tek's
flexible "Slumbering Coil Curio" uses `tierSlot: "ANY"` since it can
be exchanged for any tier slot rather than being tied to one.

**Known limitation:** `LootCatalogItem.id` is a stable local slug, not
a real Blizzard item id — bulk-resolving ~100 real numeric ids wasn't
feasible from the text sources available for this pass. Real ids
should be backfilled once sim upload (Step 3) needs to match parsed
Raidbots/QE report items against this catalog by id rather than name.

`LootTablePage.tsx` (`/loot`, open read, no verification gate — pure
reference data) toggles **By Item Slot / By Encounter**, matching the
WoWAudit screenshots' own toggle exactly, grouping the same catalog
data two different ways entirely client-side — no backend endpoint at
all, same zero-round-trip pattern `RaidEventForm`'s raid-instance
dropdown already uses for `raidCatalog.ts`. `loot.definition.ts`
flipped from fully "planned" to "active" with just "Loot Table"
marked "available" — the same mixed available/planned pattern already
used in `raid.definition.ts` (Events/Attendance available, WCL
Analysis planned).

## Roadmap (explicit next steps, not vague future work)

1. **Wishlist** — new `LootWishlistEntry` Prisma model (per-member,
   loose cross-module reference to `GuildMember`, matching
   `RaidSignup.memberId`'s convention), tier-slot preference
   (Preferred/Avoid/Not set per Helm/Shoulder/Chest/Gloves/Legs) and
   trinket 1st/2nd/3rd choice pickers sourced from the Loot Table
   catalog above.
2. **Sim upload (Droptimizer)** — a `RaidbotsClient` mirroring
   `BattleNetClient`'s pattern (plain class, module-level base URL,
   `AppError` on failure), fetching a pasted Raidbots/QE report URL
   and parsing upgrade-% per item — pending a live test fetch against
   a real report to confirm the actual JSON shape, since Raidbots'
   documentation couldn't be resolved during Step 1's research pass.
3. Loot Council, Loot History (RCLootCouncil-style awarding/sync),
   Tier/Token Planning, and Split Planning remain unstarted — each is
   its own future slice, same scale as the items above.
