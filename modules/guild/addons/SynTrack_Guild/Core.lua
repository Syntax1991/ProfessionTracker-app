local addonName, GT = ...

GT.ADDON_NAME = addonName
GT.ADDON_VERSION = "0.1.0"
GT.SCHEMA_VERSION = 1

local regionNames = {
    [1] = "US",
    [2] = "KR",
    [3] = "EU",
    [4] = "TW",
    [5] = "CN"
}

function GT.Print(message)
    print(
        "|cff9d78e8SynTrack Guild:|r "
            .. tostring(message)
    )
end

function GT.Now()
    if GetServerTime then
        return GetServerTime()
    end

    return time()
end

function GT.GetRegion()
    local regionId =
        GetCurrentRegion
        and GetCurrentRegion()
        or 0

    return regionNames[regionId]
        or tostring(regionId)
end

function GT.GetRealm()
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

function GT.IsAddonReady()
    return IsInGuild
        and IsInGuild()
        or false
end

local function initializeDatabaseTables(
    database
)
    database.members =
        database.members
        or {}
end

function GT.EnsureDatabase()
    SynTrack_GuildDB =
        SynTrack_GuildDB
        or {}

    local database =
        SynTrack_GuildDB

    initializeDatabaseTables(
        database
    )

    database.format =
        "syntrack-saved-variables"

    database.schemaVersion =
        GT.SCHEMA_VERSION

    database.addonVersion =
        GT.ADDON_VERSION

    return database
end
