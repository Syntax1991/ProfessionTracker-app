# Loot

Loot planning and distribution.

## Capabilities

- Loot Table (built 2026-08-14 — see below)
- Wishlist (built 2026-08-15 — see below)
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

**Superseded limitation (resolved 2026-08-15):** Step 1's catalog used
a stable local slug as `LootCatalogItem.id` and was sourced from text
guides, because bulk-resolving ~100 real numeric Blizzard item ids
wasn't feasible from those sources. This is resolved — see the
catalog rebuild below.

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

## Loot Table catalog rebuilt with real Blizzard API data (2026-08-15)

Mid-way through building Wishlist (which needs real item ids to store
trinket choices against), the user asked directly: **"die Loot daten
etc bitte über API anfragen"** (please fetch the loot data via API),
then generalized it into a standing rule for the whole project:
**"bitte für die Zukunft merken das wenn möglich API genutzt werden
MÜSSEN"** (please remember for the future that an API MUST be used
whenever possible). This directly resolved Step 1's documented
limitation.

`lootCatalog.ts` was regenerated from Blizzard's own Game Data API
(app-level OAuth via `client_credentials`, same credentials already in
`.env` as `BATTLENET_CLIENT_ID`/`BATTLENET_CLIENT_SECRET`):
`journal-instance`/`journal-encounter` endpoints gave the real boss
list and each boss's real `items[]` (id + name), and `/data/wow/item/
{id}` gave each item's real `inventory_type` (slot), `quality`, and
`item_level`. This is authoritative, not researched-and-cross-checked
— and it surfaced items the earlier text-source pass had missed
entirely (e.g. "Hexed Tomb Brazier", a second Nek'zali feet item), and
let non-equippable API rows be classified correctly (tier tokens and
Ula'tek's flexible token kept as real loot; housing decor, companion
pets, and the mythic-only mount excluded — a distinction only possible
with real `item_class`/`item_subclass` data). `LootCatalogItem.itemId`
is now a real `number` (Blizzard's own item id), and `slot` uses
Blizzard's raw `inventory_type` vocabulary directly (`HEAD`,
`SHOULDER`, `CHEST`, `HAND` for gloves, `TRINKET`, etc.) instead of a
hand-picked one — 104 real items across all 8 Venomous Abyss bosses.

## Wishlist (Step 2 of the WoWAudit-derived roadmap, built 2026-08-15)

Self-service, member-owned data — nobody else has a legitimate reason
to set another raider's loot preferences, unlike Boss Rosters/
Cooldowns where officers assign other people. Mirrors
`raid/api/signups`'s exact pattern: `wishlist.service.ts` resolves the
caller's own `GuildMember` via `guildRaiderLinkService.getLinkedMember
(token)` rather than trusting an officer-supplied `memberId`, and
carries no `GuildVerificationGuard` dependency at all since nothing
here needs officer gating.

Two Prisma models, kept separate because they're different shapes
(slot-status vs. ranked-item), same reasoning that already keeps
`RaidBossRosterEntry` and `RaidCooldownAssignment` as distinct tables
rather than one flexible one:

- `LootTierPreference` (`memberId` + `tierSlot` unique, `status`:
  `PREFERRED` | `AVOID`) — one row per slot the member has an opinion
  on; "not set" is simply the absence of a row.
- `LootTrinketChoice` (`memberId` + `rank` unique, `rank`: 1–3,
  `itemId`: real Blizzard item id, validated against the rebuilt
  catalog's `TRINKET`-slot items) — picking the same item at a
  different rank moves it (`clearItemFromOtherRanks` runs before the
  upsert) rather than letting one item occupy two ranks at once.

Routes mounted at `/loot/wishlist`: `GET /me`, `PUT`/`DELETE
/me/tier/:tierSlot`, `PUT`/`DELETE /me/trinket/:rank` — all bearer-
token self-service, 403 with the same unlinked-account message
`signup.service.ts` already uses if the caller has no linked
`GuildMember`.

`WishlistPage.tsx` (`/loot/wishlist`) is two small tables: 5 tier-slot
dropdowns (Not set/Preferred/Avoid) and 3 trinket-rank dropdowns (Not
set + every real trinket from the catalog, labelled `Item — Boss`).
`loot.definition.ts`'s "Wishlist" nav item flipped to "available".

## Roadmap (explicit next steps, not vague future work)

1. **Sim upload (Droptimizer)** — a `RaidbotsClient` mirroring
   `BattleNetClient`'s pattern (plain class, module-level base URL,
   `AppError` on failure), fetching a pasted Raidbots/QE report URL
   and parsing upgrade-% per item — pending a live test fetch against
   a real report to confirm the actual JSON shape, since Raidbots'
   documentation couldn't be resolved during Step 1's research pass.
2. Loot Council, Loot History (RCLootCouncil-style awarding/sync),
   Tier/Token Planning, and Split Planning remain unstarted — each is
   its own future slice, same scale as the item above.
