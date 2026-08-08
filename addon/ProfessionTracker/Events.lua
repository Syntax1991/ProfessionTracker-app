local addonName, PT = ...

local eventFrame =
    CreateFrame("Frame")

local pendingRefreshTimer = nil
local pendingRefreshReason = nil

local automaticRefreshEvents = {
    PLAYER_LOGIN = {
        reason = "login",
        delay = 1.5
    },

    PLAYER_ENTERING_WORLD = {
        reason = "entering-world",
        delay = 1.5
    },

    PLAYER_LEVEL_UP = {
        reason = "level-up",
        delay = 0.5
    },

    SKILL_LINES_CHANGED = {
        reason = "skill-lines-changed",
        delay = 0.5
    },

    TRADE_SKILL_SHOW = {
        reason = "trade-skill-show",
        delay = 0.15
    },

    TRADE_SKILL_LIST_UPDATE = {
        reason = "trade-skill-list-update",
        delay = 0.25
    },

    TRADE_SKILL_DATA_SOURCE_CHANGED = {
        reason = "trade-skill-data-source-changed",
        delay = 0.25
    },

    TRAIT_CONFIG_UPDATED = {
        reason = "profession-trait-config-updated",
        delay = 0.15
    },

    TRADE_SKILL_CLOSE = {
        reason = "trade-skill-close",
        delay = 0.25
    }
}

local function trimCommand(
    value
)
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

local function cancelPendingRefresh()
    if pendingRefreshTimer
        and pendingRefreshTimer.Cancel
    then
        pendingRefreshTimer:Cancel()
    end

    pendingRefreshTimer = nil
end

local function refreshCharacter(
    reason
)
    return PT.RefreshCharacter(
        reason
    )
end

local function getProfessionCount(
    character
)
    if not character
        or type(
            character.professions
        ) ~= "table"
    then
        return 0
    end

    return #character.professions
end

local function getProfessionLabel(
    professionCount
)
    if professionCount == 1 then
        return "Beruf"
    end

    return "Berufe"
end

local function printSyncCompleted(
    label,
    character
)
    local professionCount =
        getProfessionCount(
            character
        )

    PT.Print(
        string.format(
            "%s abgeschlossen · %s-%s · %d %s aktualisiert.",
            label,
            character.name
                or "Unknown",
            character.realm
                or "Unknown",
            professionCount,
            getProfessionLabel(
                professionCount
            )
        )
    )
end

local function runRefresh(
    reason,
    label,
    announce
)
    if announce then
        PT.Print(
            label
                .. " gestartet …"
        )
    end

    local success,
        character =
        pcall(
            refreshCharacter,
            reason
        )

    if not success then
        PT.Print(
            label
                .. " fehlgeschlagen: "
                .. tostring(
                    character
                )
        )

        return nil
    end

    if not character then
        PT.Print(
            label
                .. " fehlgeschlagen."
        )

        return nil
    end

    if announce then
        printSyncCompleted(
            label,
            character
        )
    end

    return character
end

local function runScheduledRefresh()
    local reason =
        pendingRefreshReason
        or "automatic"

    pendingRefreshTimer = nil
    pendingRefreshReason = nil

    runRefresh(
        reason,
        "Auto-Sync",
        true
    )
end

local function scheduleRefresh(
    reason,
    delay
)
    pendingRefreshReason =
        reason
        or "automatic"

    cancelPendingRefresh()

    if C_Timer
        and C_Timer.NewTimer
    then
        pendingRefreshTimer =
            C_Timer.NewTimer(
                delay
                or 0.25,
                runScheduledRefresh
            )

        return
    end

    runScheduledRefresh()
end

local function handleSlashCommand(
    input
)
    local command =
        trimCommand(
            input
        )

    if command == ""
        or command == "status"
    then
        PT.PrintStatus()
        return
    end

    if command == "sync" then
        cancelPendingRefresh()

        runRefresh(
            "manual",
            "Manueller Sync",
            true
        )

        return
    end

    PT.Print(
        "Befehle: /pt status, /pt sync"
    )
end

local function initializeSlashCommands()
    SLASH_PROFESSIONTRACKER1 =
        "/professiontracker"

    SLASH_PROFESSIONTRACKER2 =
        "/pt"

    SlashCmdList.PROFESSIONTRACKER =
        handleSlashCommand
end

local function handleAddonLoaded(
    loadedAddonName
)
    if loadedAddonName ~= addonName then
        return
    end

    PT.EnsureDatabase()
    initializeSlashCommands()
end

local function handleLogout()
    cancelPendingRefresh()

    runRefresh(
        "logout",
        "Auto-Sync",
        false
    )
end

local function handleEvent(
    _,
    event,
    argument
)
    if event == "ADDON_LOADED" then
        handleAddonLoaded(
            argument
        )

        return
    end

    if event == "PLAYER_LOGOUT" then
        handleLogout()
        return
    end

    local configuration =
        automaticRefreshEvents[
            event
        ]

    if not configuration then
        return
    end

    scheduleRefresh(
        configuration.reason,
        configuration.delay
    )
end

eventFrame:RegisterEvent(
    "ADDON_LOADED"
)

eventFrame:RegisterEvent(
    "PLAYER_LOGOUT"
)

for event in pairs(
    automaticRefreshEvents
) do
    eventFrame:RegisterEvent(
        event
    )
end

eventFrame:SetScript(
    "OnEvent",
    handleEvent
)