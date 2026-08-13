local _, private = ...
local API = private.API

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
    local status =
        API.GetStatus()

    API.Print(
        string.format(
            "v%s | Core-Schema %d | %d Charaktere | %d Module",
            status.addonVersion,
            status.coreSchemaVersion,
            status.characters,
            status.modules
        )
    )
end

local function printModules()
    local modules =
        API.GetRegisteredModules()

    local names = {}

    for moduleId in pairs(
        modules
    ) do
        table.insert(
            names,
            moduleId
        )
    end

    table.sort(
        names
    )

    API.Print(
        #names > 0
            and "Module: "
                .. table.concat(
                    names,
                    ", "
                )
            or "Keine Module registriert."
    )
end

local function capture()
    local _,
        captured,
        failures =
        API.RefreshExport(
            "manual"
        )

    local failureCount = 0

    for _ in pairs(
        failures
    ) do
        failureCount =
            failureCount + 1
    end

    API.Print(
        string.format(
            "%d Module erfasst, %d Fehler. /reload speichert die Daten auf die Festplatte.",
            captured,
            failureCount
        )
    )
end

local function handleSlashCommand(input)
    local command =
        trimCommand(
            input
        )

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

    if command == "modules" then
        printModules()
        return
    end

    API.Print(
        "Befehle: /stcore status, /stcore capture, /stcore modules"
    )
end

function private.InitializeSlashCommands()
    SLASH_SYNTRACKCORE1 =
        "/syntrackcore"

    SLASH_SYNTRACKCORE2 =
        "/stcore"

    SlashCmdList.SYNTRACKCORE =
        handleSlashCommand
end
