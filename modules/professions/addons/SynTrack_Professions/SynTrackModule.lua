local _, PT = ...

local moduleId =
    "professions"

local function captureModuleMetadata()
    local database =
        PT.EnsureDatabase()

    return {
        storage =
            "ProfessionTrackerDB",
        storageOwner =
            "SynTrack_Professions",
        schemaVersion =
            PT.SCHEMA_VERSION,
        addonVersion =
            PT.ADDON_VERSION,
        lastUpdatedAt =
            database.lastUpdatedAt
    }
end

local function registerModule()
    if not SynTrack
        or not SynTrack.RegisterModule
    then
        PT.Print(
            "SynTrack_Core ist nicht verfügbar."
        )

        return
    end

    local succeeded,
        errorMessage =
        SynTrack.RegisterModule({
            id = moduleId,
            name =
                "SynTrack Professions",
            version =
                PT.ADDON_VERSION,
            schemaVersion =
                PT.SCHEMA_VERSION,
            scope = "account",
            capture =
                captureModuleMetadata
        })

    if not succeeded then
        PT.Print(
            "Core-Registrierung fehlgeschlagen: "
                .. tostring(errorMessage)
        )
    end
end

function PT.NotifyCore(reason)
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
                or "profession-refresh"
        )

    if not succeeded then
        PT.Print(
            "Core-Metadaten konnten nicht aktualisiert werden: "
                .. tostring(errorMessage)
        )
    end

    return succeeded
end

registerModule()
