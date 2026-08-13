local addonName, private = ...

local API = _G.SynTrack

if type(API) ~= "table" then
    API = {}
    _G.SynTrack = API
end

private.API = API

API.ADDON_NAME = addonName
API.ADDON_VERSION = "0.1.0"
API.CORE_SCHEMA_VERSION = 1
API.SAVED_VARIABLES_SCHEMA_VERSION = 1
API.SAVED_VARIABLES_NAME = "SynTrackCoreDB"

function API.Print(message)
    print(
        "|cff9d78e8SynTrack Core:|r "
            .. tostring(message)
    )
end

function API.NormalizeKeyPart(value)
    local normalizedValue =
        string.lower(
            tostring(
                value
                or "unknown"
            )
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

function private.GetClientInfo()
    local version,
        build,
        _,
        interfaceVersion =
        GetBuildInfo()

    return {
        version = version or "unknown",
        build = build or "unknown",
        interfaceVersion =
            interfaceVersion
            or 0,
        locale =
            GetLocale
            and GetLocale()
            or "unknown"
    }
end

function private.Now()
    if GetServerTime then
        return GetServerTime()
    end

    return time()
end
