local _, GT = ...

local moduleId =
    "guild"

local function captureModuleMetadata()
    local database =
        GT.EnsureDatabase()

    return {
        storage =
            "SynTrack_GuildDB",
        storageOwner =
            "SynTrack_Guild",
        schemaVersion =
            GT.SCHEMA_VERSION,
        addonVersion =
            GT.ADDON_VERSION,
        guildName =
            database.guildName,
        memberCount =
            #database.members,
        lastUpdatedAt =
            database.capturedAt
    }
end

local function registerModule()
    if not SynTrack
        or not SynTrack.RegisterModule
    then
        GT.Print(
            "SynTrack_Core ist nicht verfügbar."
        )

        return
    end

    local succeeded,
        errorMessage =
        SynTrack.RegisterModule({
            id = moduleId,
            name =
                "SynTrack Guild",
            version =
                GT.ADDON_VERSION,
            schemaVersion =
                GT.SCHEMA_VERSION,
            scope = "account",
            capture =
                captureModuleMetadata
        })

    if not succeeded then
        GT.Print(
            "Core-Registrierung fehlgeschlagen: "
                .. tostring(errorMessage)
        )
    end
end

function GT.NotifyCore(reason)
    if not SynTrack
        or not SynTrack.CaptureModule
    then
        return false
    end

    local succeeded,
        errorMessage =
        SynTrack.CaptureModule(
            moduleId,
            reason
                or "guild-refresh"
        )

    if not succeeded then
        GT.Print(
            "Core-Metadaten konnten nicht aktualisiert werden: "
                .. tostring(errorMessage)
        )
    end

    return succeeded
end

registerModule()
