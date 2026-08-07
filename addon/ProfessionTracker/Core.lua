local addonName, PT = ...

PT.ADDON_NAME = addonName
PT.ADDON_VERSION = "0.1.0"
PT.SCHEMA_VERSION = 1

local regionNames = {
    [1] = "US",
    [2] = "KR",
    [3] = "EU",
    [4] = "TW",
    [5] = "CN"
}

function PT.Print(
    message
)
    print(
        "|cff9d78e8Profession Tracker:|r "
            .. tostring(message)
    )
end

function PT.NormalizeKeyPart(
    value
)
    if value == nil then
        return "unknown"
    end

    local normalizedValue =
        tostring(value)

    normalizedValue =
        string.lower(
            normalizedValue
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

    return regionNames[
        regionId
    ]
        or tostring(
            regionId
        )
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

function PT.EnsureDatabase()
    ProfessionTrackerDB =
        ProfessionTrackerDB
        or {}

    ProfessionTrackerDB.schemaVersion =
        PT.SCHEMA_VERSION

    ProfessionTrackerDB.addonVersion =
        PT.ADDON_VERSION

    ProfessionTrackerDB.characters =
        ProfessionTrackerDB.characters
        or {}

    ProfessionTrackerDB.client =
        PT.GetClientInfo()

    return ProfessionTrackerDB
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
    local characterCount =
        PT.GetStoredCharacterCount()

    PT.Print(
        string.format(
            "Version %s · %d gespeicherte Charaktere",
            PT.ADDON_VERSION,
            characterCount
        )
    )
end