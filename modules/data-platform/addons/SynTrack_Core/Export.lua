local _, private = ...
local API = private.API

function API.RefreshExport(reason)
    API.CaptureCurrentCharacter(
        reason
        or "export-refresh"
    )

    local captured,
        failures =
        API.CaptureAllModules(
            reason
            or "export-refresh"
        )

    local database =
        private.TouchDatabase(
            reason
            or "export-refresh"
        )

    return database,
        captured,
        failures
end

function API.GetExport()
    return API.EnsureDatabase()
end

function API.GetExportContract()
    return {
        format =
            "syntrack-saved-variables",
        savedVariables =
            API.SAVED_VARIABLES_NAME,
        schemaVersion =
            API.SAVED_VARIABLES_SCHEMA_VERSION,
        coreSchemaVersion =
            API.CORE_SCHEMA_VERSION
    }
end

function API.GetStatus()
    local database =
        API.EnsureDatabase()

    local characterCount = 0
    local moduleCount = 0

    for _ in pairs(
        database.characters
    ) do
        characterCount =
            characterCount + 1
    end

    for _ in pairs(
        database.modules
    ) do
        moduleCount =
            moduleCount + 1
    end

    return {
        addonVersion =
            API.ADDON_VERSION,
        coreSchemaVersion =
            API.CORE_SCHEMA_VERSION,
        characters = characterCount,
        modules = moduleCount,
        lastUpdatedAt =
            database.lastUpdatedAt
    }
end
