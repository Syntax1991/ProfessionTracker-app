# Profession Tracker WoW Addon

This directory contains the in-game data collector for Profession Tracker.

## Architecture

The addon is intentionally split into small modules.

Core.lua
Shared addon constants, helpers and SavedVariables database access.

Professions.lua
Collects the two primary professions and their basic skill data.

Character.lua
Builds the current character snapshot and stores it in ProfessionTrackerDB.

Events.lua
Handles WoW events and slash commands.

## Current scope

Version 0.1.0 stores:

- Character name
- Realm
- Region
- Class
- Character level
- Two primary professions
- Profession skill
- Profession maximum skill
- Profession skill-line ID
- Profession skill modifier
- Snapshot timestamp
- Addon version
- WoW client version
- WoW build
- WoW interface version

Specialization nodes and known recipes are reserved in the data model and will be implemented separately.

## SavedVariables

The account-wide SavedVariables table is named ProfessionTrackerDB.

World of Warcraft writes it into the account SavedVariables directory.

Typical relative location:

    WTF\Account\<Account>\SavedVariables\ProfessionTracker.lua

## In-game commands

    /pt
    /pt status
    /pt sync

The sync command refreshes the current in-memory snapshot.

Use /reload or log out afterward when the SavedVariables file needs to be written immediately.

## Development installation

Copy the ProfessionTracker directory into:

    World of Warcraft\_retail_\Interface\AddOns\

The resulting manifest location must be:

    World of Warcraft\_retail_\Interface\AddOns\ProfessionTracker\ProfessionTracker.toc