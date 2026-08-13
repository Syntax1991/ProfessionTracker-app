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

Module-owned addons send data through Data Platform contracts. Data
Platform normalizes external data; consuming modules own its business
interpretation.
