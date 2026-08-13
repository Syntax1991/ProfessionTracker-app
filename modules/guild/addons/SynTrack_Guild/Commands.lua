local _, GT = ...

local function trimCommand(value)
    local command =
        string.lower(
            value
            or ""
        )

    return string.match(
        command,
        "^%s*(.-)%s*$"
    )
end

local function printStatus()
    local database =
        GT.EnsureDatabase()

    GT.Print(
        string.format(
            "v%s | %s | %d Mitglieder erfasst",
            GT.ADDON_VERSION,
            database.guildName
                or "kein Gilden-Snapshot",
            #database.members
        )
    )
end

local function capture()
    if not GT.IsAddonReady() then
        GT.Print(
            "Du bist in keiner Gilde."
        )

        return
    end

    GT.RequestRosterUpdate()

    local database =
        GT.CaptureRoster(
            "manual"
        )

    if GT.NotifyCore then
        GT.NotifyCore("manual")
    end

    GT.Print(
        string.format(
            "%d Mitglieder aus dem aktuellen Cache erfasst. /reload speichert die Daten auf die Festplatte.",
            #database.members
        )
    )
end

local function handleSlashCommand(input)
    local command =
        trimCommand(input)

    if command == ""
        or command == "status"
    then
        printStatus()
        return
    end

    if command == "capture" then
        capture()
        return
    end

    GT.Print(
        "Befehle: /stguild status, /stguild capture"
    )
end

SLASH_SYNTRACKGUILD1 =
    "/syntrackguild"

SLASH_SYNTRACKGUILD2 =
    "/stguild"

SlashCmdList.SYNTRACKGUILD =
    handleSlashCommand
