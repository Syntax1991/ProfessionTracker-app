local addonName, PT = ...

PT.ADDON_NAME = addonName
PT.ADDON_VERSION = "0.7.7"
PT.SCHEMA_VERSION = 10
PT.STORAGE_SCOPE_VERSION = 1

local regionNames = {
    [1] = "US",
    [2] = "KR",
    [3] = "EU",
    [4] = "TW",
    [5] = "CN"
}

function PT.Print(message)
    print(
        "|cff9d78e8SynTrack:|r "
            .. tostring(message)
    )
end

function PT.NormalizeKeyPart(value)
    if value == nil then
        return "unknown"
    end

    local normalizedValue =
        string.lower(
            tostring(value)
        )

    normalizedValue =
        string.gsub(
            normalizedValue,
            "%s+",
            ""
        )

    if normalizedValue == "" then
        return "unknown"
    end

    return normalizedValue
end

function PT.GetRegion()
    local regionId = 0

    if GetCurrentRegion then
        regionId =
            GetCurrentRegion()
            or 0
    end

    return regionNames[regionId]
        or tostring(regionId)
end

function PT.GetRealm()
    if GetNormalizedRealmName then
        local normalizedRealm =
            GetNormalizedRealmName()

        if normalizedRealm
            and normalizedRealm ~= ""
        then
            return normalizedRealm
        end
    end

    return GetRealmName()
        or "Unknown"
end

function PT.GetClientInfo()
    local version,
        build,
        _,
        interfaceVersion =
        GetBuildInfo()

    return {
        version =
            version
            or "unknown",

        build =
            build
            or "unknown",

        interfaceVersion =
            interfaceVersion
            or 0
    }
end

local function initializeDatabaseTables(
    database
)
    database.characters =
        database.characters
        or {}

    database.professionCatalog =
        database.professionCatalog
        or {}

    database.recipeCatalog =
        database.recipeCatalog
        or {}

    database.characterRecipeOperations =
        database.characterRecipeOperations
        or {}
end

local function compactDatabaseIfNeeded(
    database
)
    if database.storageScopeVersion
        == PT.STORAGE_SCOPE_VERSION
    then
        return
    end

    if not PT.CompactCurrentAddonState then
        return
    end

    PT.CompactCurrentAddonState(
        database
    )

    database.storageScopeVersion =
        PT.STORAGE_SCOPE_VERSION
end

function PT.EnsureDatabase()
    ProfessionTrackerDB =
        ProfessionTrackerDB
        or {}

    local database =
        ProfessionTrackerDB

    initializeDatabaseTables(
        database
    )

    compactDatabaseIfNeeded(
        database
    )

    database.schemaVersion =
        PT.SCHEMA_VERSION

    database.addonVersion =
        PT.ADDON_VERSION

    database.client =
        PT.GetClientInfo()

    return database
end

function PT.GetStoredCharacterCount()
    local database =
        PT.EnsureDatabase()

    local characterCount = 0

    for _ in pairs(
        database.characters
    ) do
        characterCount =
            characterCount + 1
    end

    return characterCount
end

function PT.PrintStatus()
    PT.Print(
        string.format(
            "Version %s · %d gespeicherte Charaktere · Auto-Sync aktiv",
            PT.ADDON_VERSION,
            PT.GetStoredCharacterCount()
        )
    )
end