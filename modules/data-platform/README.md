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
