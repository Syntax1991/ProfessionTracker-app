# Data Platform

External ingestion, synchronization and transport contracts.

## Capabilities

- Battle.net
- Raider.io
- Warcraft Logs
- SynTrack addon ingestion
- SynTrack Companion synchronization

## Current source

- API: `modules/data-platform/api`
- Web: `modules/data-platform/web`
- Addon runtime: `modules/data-platform/addons/SynTrack_Core`

Module-owned addons send data through Data Platform contracts. Data
Platform normalizes external data; consuming modules own its business
interpretation.

## Raider Login (unified sign-in for all of SynTrack)

`modules/data-platform/api/raider-auth` is SynTrack's **only**
Battle.net OAuth flow. Originally built (2026-08-14) as a second flow
alongside a single-owner "connect Battle.net" integration used just
for the app owner — the user then clarified that *everything* in
SynTrack should be protected by one login, not just Guild/Raid, and
that this login should replace the owner-only one rather than run
alongside it (see the `project_raider_login` memory). The old
`battlenet-auth.service.ts` / `battlenet-connection.guard.ts` /
`BattleNetConnection` singleton and its `/api/auth/battlenet` routes
were deleted; `integrations/battlenet` now only holds the character
list/import logic My SynTrack still needs
(`BattleNetImportService.listCharacters`/`importCharacters`), sourced
from whoever is currently logged in.

`BattleNetClient.createAuthorizationUrl` / `exchangeAuthorizationCode`
take a `redirectUri` parameter (`BATTLENET_RAIDER_REDIRECT_URI`,
`/api/auth/raider/callback` — **registered manually in the Blizzard
application's allowed redirect URIs, not something the codebase can
configure**).

A successful login creates (or reuses, by `battleTag`) a
`RaiderAccount`, storing both a one-time JSON snapshot of the
account's WoW characters (`RaiderSession.charactersJson`, used for
Guild's roster-linking match) **and** the live Blizzard access token
(`accessToken`/`tokenType`/`scope`/`tokenExpiresAt`, refreshed on
every login) — the latter is what makes unification possible: any
module needing a live Blizzard call (Guild verification, Gear Audit,
character import) resolves it from *whoever is currently logged in*
via `RaiderAuthService.requireUsableAccessToken(token)`, the direct
replacement for the old `getUsableBattleNetConnection` singleton
guard. `RaiderSessionGuard.requireSession(token)` (identity only, no
live token) is still used where a call just needs to know "who is
this," e.g. Guild's `raider-link` roster matching.

The frontend stores the bearer token in `localStorage` (not a cookie —
the web app and API run on different origins/ports, and cross-origin
cookies need `SameSite=None; Secure`, which is fragile in local HTTP
dev). `apps/web/src/shared/api/httpClient.ts` attaches it as
`Authorization: Bearer <token>` automatically when present. The OAuth
callback redirects to `/raider-login#token=...` (a URL *fragment*,
never sent to servers or logged) rather than a query parameter.

`apps/web/src/shared/components/RequireRaiderSession.tsx` wraps the
entire app shell (`AppLayout.tsx`) — no route is reachable without a
valid session; a full-page "Sign in to SynTrack" screen renders
instead of the app chrome otherwise. The OAuth callback route
(`/raider-login`) is deliberately a top-level sibling route outside
that wrapped block, since it has to be reachable pre-login.
`modules/data-platform/web/raider-auth/components/RaiderAuthTopAction.tsx`
is the single sign-in control, in the persistent nav (mirroring
WoWUtils' top-right "Sign in with Battle.net" button per explicit
user feedback — not embedded in individual pages).

## No standalone nav presence (moved into Settings, 2026-08-14)

Data Platform used to have its own top-level sidebar module ("Data
Platform": SynTrack Addon at `/addon`, Battle.net at `/battlenet`,
plus planned Raider.io/Warcraft Logs/SynTrack Companion entries),
after the user asked directly: "alles was data platform ist unter
settings umziehen" (move everything that's Data Platform under
Settings). Both pages' business logic (hooks, API calls,
sub-components) stayed in `modules/data-platform/web/integrations`
unchanged throughout — only the page shell moved, replaced by thin
`AddonSyncTab.tsx`/`BattleNetSyncTab.tsx` components (no `PageHeader`,
since the hosting Settings page already renders one), imported
cross-module into Guild's Settings pages — same composition pattern
Raid already uses for Guild's `GuildVerificationGate`.

Where they landed took two passes. First pass: asked which of the two
built pages is personal vs. guild-scoped ("personal und guild"), and
the user picked splitting **Battle.net character sync** into
`GuildSettingsPage` (`/guild/settings`) while **WoW Addon Sync** went
to the personal `SettingsPage` (`/settings`). This broke My SynTrack's
own "Sync data" dashboard button, which links to `/battlenet` expecting
a personal-account page, not a Guild-branded one — the user then drew
the actual line explicitly: **"in personal werden Char Daten etc. Im
guild dient nur zu Rechte-Verifizierung"** (personal gets character
data, Guild is purely for rights/leadership verification). Final
state: `SettingsPage` (`/settings`) has all three tabs — Account, WoW
Addon, Battle.net; `GuildSettingsPage` (`/guild/settings`) reverted to
single-purpose verification content, no tabs, nothing data-platform
related. `dataPlatform.definition.ts` and the `"data-platform"` module
id are deleted entirely; `/addon` and `/battlenet` both redirect to
`/settings`. `RaiderLoginCallbackPage` (the OAuth landing route) was
left untouched — it's infrastructure, not a nav-reachable page.

**Durable rule going forward:** Guild Settings is reserved for
guild-leadership/identity concerns only. Any future data-platform
integration, even one that touches guild-adjacent data, defaults to
the personal Settings page unless it is specifically about verifying
or representing guild leadership itself.
