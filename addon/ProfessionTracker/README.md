# Profession Tracker WoW Addon

This directory contains the in-game data collector for Profession Tracker.

## Version 0.3.0

Version 0.3.0 stores profession specialization data separately for every expansion skill line.

This allows one profession to retain both current Midnight specialization data and older expansion data such as The War Within.

## Expansion-aware structure

A profession can contain multiple expansion snapshots.

Example:

    Alchemy
      Midnight Alchemy
        skillLineId: 2906
        specializations: ...
      Khaz Algar Alchemy
        skillLineId: 2871
        specializations: ...

Opening and synchronizing one expansion no longer overwrites previously captured specialization data from another expansion.

## Architecture

Core.lua

Shared constants, helper functions and SavedVariables database access.

SpecializationEntries.lua

Reads trait entries and their definitions.

SpecializationTraits.lua

Reads trait nodes, ranks and currencies.

SpecializationTabs.lua

Reads specialization tabs and root paths.

Specializations.lua

Resolves the currently selected expansion profession skill line and captures its specialization configuration.

Professions.lua

Stores specialization snapshots per expansion skill line.

Character.lua

Builds and persists character snapshots.

Events.lua

Handles profession events and slash commands.

## Capturing multiple expansions

For Midnight:

    1. Open the profession.
    2. Select the Midnight profession section.
    3. Run /pt sync.

For The War Within:

    1. Switch the profession window to the Khaz Algar / The War Within section.
    2. Run /pt sync.

Repeat this for the second primary profession.

Afterward run:

    /reload

The SavedVariables file will retain every captured expansion separately.

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