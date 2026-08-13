local _, private = ...
local API = private.API

local regionNames = {
    [1] = "US",
    [2] = "KR",
    [3] = "EU",
    [4] = "TW",
    [5] = "CN"
}

function API.GetRegion()
    local regionId =
        GetCurrentRegion
        and GetCurrentRegion()
        or 0

    return regionNames[regionId]
        or tostring(regionId)
end

function API.GetRealm()
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

function API.CreateCharacterKey(
    identity
)
    return table.concat(
        {
            API.NormalizeKeyPart(
                identity.region
            ),
            API.NormalizeKeyPart(
                identity.realm
            ),
            API.NormalizeKeyPart(
                identity.name
            )
        },
        ":"
    )
end

function API.GetCurrentCharacterIdentity()
    if UnitExists
        and not UnitExists("player")
    then
        return nil
    end

    local className,
        classFile,
        classId =
        UnitClass("player")

    local identity = {
        name =
            UnitName("player")
            or "Unknown",
        realm = API.GetRealm(),
        region = API.GetRegion(),
        className =
            className
            or "Unknown",
        classFile =
            classFile
            or "UNKNOWN",
        classId =
            classId
            or 0,
        level =
            UnitLevel("player")
            or 0,
        guid =
            UnitGUID("player")
    }

    identity.key =
        API.CreateCharacterKey(
            identity
        )

    return identity
end

function API.CaptureCurrentCharacter(reason)
    local identity =
        API.GetCurrentCharacterIdentity()

    if not identity then
        return nil
    end

    local database =
        API.EnsureDatabase()

    local character =
        database.characters[
            identity.key
        ]
        or {}

    for key, value in pairs(
        identity
    ) do
        character[key] = value
    end

    character.modules =
        character.modules
        or {}

    character.lastUpdatedAt =
        private.Now()

    character.snapshotReason =
        reason
        or "identity-refresh"

    database.characters[
        identity.key
    ] = character

    private.TouchDatabase(
        character.snapshotReason
    )

    return character
end
