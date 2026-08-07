# Profession Tracker WoW Addon

This directory contains the in-game data collector for Profession Tracker.

## Version 0.2.1

The addon captures profession specialization data from the currently opened Retail profession.

Version 0.2.1 replaces the legacy TRADE_SKILL_UPDATE event with the Retail-compatible TRADE_SKILL_LIST_UPDATE event.

## Architecture

Core.lua

Shared constants, helper functions and SavedVariables database access.

SpecializationEntries.lua

Reads trait entries and their definitions, spell IDs, names and metadata.

SpecializationTraits.lua

Reads specialization trait nodes, invested ranks and tree currencies.

SpecializationTabs.lua

Reads profession specialization tabs, root paths and their trait nodes.

Specializations.lua

Resolves the currently opened profession, specialization config and specialization tabs.

Professions.lua

Collects the two primary professions and preserves previously captured specialization data.

Character.lua

Builds and persists the current character snapshot.

Events.lua

Handles WoW profession events and slash commands.

## Captured specialization data

The addon stores:

- Expansion profession skill-line ID
- Profession specialization config ID
- Available profession knowledge
- Specialization tab IDs
- Specialization tab names
- Trait tree IDs
- Root path information
- Trait node IDs
- Node positions
- Node availability
- Purchased ranks
- Active ranks
- Current ranks
- Maximum ranks
- Total maximum ranks
- Trait entries
- Entry definitions
- Spell IDs and names where available
- Trait currency totals
- Capture timestamps

## Capturing specialization data

For every profession on a character:

    1. Open the profession window.
    2. Wait until the profession UI has loaded.
    3. Run /pt sync.
    4. Open the second profession.
    5. Run /pt sync.
    6. Run /reload.

Previously captured data for the other profession is preserved.

## SavedVariables

The account-wide table is:

    ProfessionTrackerDB

Typical path:

    WTF\Account\<Account>\SavedVariables\ProfessionTracker.lua

## Commands

    /pt
    /pt status
    /pt sync

## Development installation

Copy the ProfessionTracker directory into:

    World of Warcraft\_retail_\Interface\AddOns\

The manifest must be located at:

    World of Warcraft\_retail_\Interface\AddOns\ProfessionTracker\ProfessionTracker.toc