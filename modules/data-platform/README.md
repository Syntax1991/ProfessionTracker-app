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

## Raider Login

`modules/data-platform/api/raider-auth` is a second, independent
Battle.net OAuth flow alongside the existing single-owner integration
(`integrations/battlenet`) — it lets *any* guild member sign in with
their own Battle.net account, not just the app owner. It reuses
`BattleNetClient`/`BattleNetRepository` (both now accept an explicit
`redirectUri`, defaulting to the existing `BATTLENET_REDIRECT_URI` so
the owner-connection flow is unchanged) with a second registered
redirect URI, `BATTLENET_RAIDER_REDIRECT_URI`
(`/api/auth/raider/callback`). **This second redirect URI must be
added manually to the Blizzard application's allowed redirect URIs —
it is not something the codebase can configure.**

A successful login creates (or reuses, by `battleTag`) a
`RaiderAccount` and a `RaiderSession` (a random bearer token, 30-day
expiry). No Blizzard access token is stored beyond the callback
request — only a JSON snapshot of the account's WoW characters
(`RaiderSession.charactersJson`), taken once at login time. Data
Platform deliberately knows nothing about guilds or rosters; it only
exposes `RaiderSessionGuard.requireSession(token)` as a typed
contract, consumed the same way Guild already consumes
`getUsableBattleNetConnection` — Guild's `raider-link` capability does
the actual roster matching (see `modules/guild/README.md`).

The frontend stores the bearer token in `localStorage` (not a cookie —
the web app and API run on different origins/ports, and cross-origin
cookies need `SameSite=None; Secure`, which is fragile in local HTTP
dev). `apps/web/src/shared/api/httpClient.ts` attaches it as
`Authorization: Bearer <token>` automatically when present. The OAuth
callback redirects to `/raider-login#token=...` (a URL *fragment*,
never sent to servers or logged) rather than a query parameter.
