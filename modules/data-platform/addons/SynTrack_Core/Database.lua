local _, private = ...
local API = private.API

local function initializeTables(database)
    database.characters =
        database.characters
        or {}

    database.modules =
        database.modules
        or {}

    database.accountModules =
        database.accountModules
        or {}
end

function API.EnsureDatabase()
    SynTrackCoreDB =
        SynTrackCoreDB
        or {}

    local database =
        SynTrackCoreDB

    initializeTables(
        database
    )

    database.format =
        "syntrack-saved-variables"

    database.schemaVersion =
        API.SAVED_VARIABLES_SCHEMA_VERSION

    database.coreSchemaVersion =
        API.CORE_SCHEMA_VERSION

    database.addonVersion =
        API.ADDON_VERSION

    database.client =
        private.GetClientInfo()

    return database
end

function API.GetDatabase()
    return API.EnsureDatabase()
end

function private.TouchDatabase(reason)
    local database =
        API.EnsureDatabase()

    database.lastUpdatedAt =
        private.Now()

    database.snapshotReason =
        reason
        or "unknown"

    return database
end
