local addonName, PT = ...

local eventFrame =
    CreateFrame("Frame")

local pendingTimer = nil
local pendingReason = nil
local pendingAnnounce = false

local hasAnnouncedInitialSync =
    false

local automaticRefreshEvents = {
    PLAYER_LEVEL_UP = {
        reason = "level-up",
        delay = 0.5,
        announce = false
    },

    SKILL_LINES_CHANGED = {
        reason = "skill-lines-changed",
        delay = 1.5,
        announce = false
    },

    TRADE_SKILL_SHOW = {
        reason = "trade-skill-show",
        delay = 0.15,
        announce = false
    },

    TRADE_SKILL_LIST_UPDATE = {
        reason = "trade-skill-list-update",
        delay = 0.25,
        announce = false
    },

    TRADE_SKILL_DATA_SOURCE_CHANGED = {
        reason = "trade-skill-data-source-changed",
        delay = 0.25,
        announce = false
    },

    TRAIT_CONFIG_UPDATED = {
        reason = "profession-trait-config-updated",
        delay = 0.15,
        announce = false
    },

    TRADE_SKILL_CLOSE = {
        reason = "trade-skill-close",
        delay = 0.25,
        announce = false
    }
}

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

local function cancelPendingTimer()
    if pendingTimer
        and pendingTimer.Cancel
    then
        pendingTimer:Cancel()
    end

    pendingTimer = nil
end

local function clearPendingRefresh()
    cancelPendingTimer()

    pendingReason = nil
    pendingAnnounce = false
end

local function runScheduledRefresh()
    local reason =
        pendingReason
        or "automatic"

    local announce =
        pendingAnnounce
        == true

    pendingTimer = nil
    pendingReason = nil
    pendingAnnounce = false

    PT.RunProfessionRefresh(
        reason,
        "Auto-Sync",
        announce
    )
end

local function scheduleRefresh(
    reason,
    delay,
    announce
)
    pendingAnnounce =
        pendingAnnounce
        or announce
        == true

    pendingReason =
        reason
        or "automatic"

    cancelPendingTimer()

    if C_Timer
        and C_Timer.NewTimer
    then
        pendingTimer =
            C_Timer.NewTimer(
                delay
                or 0.25,
                runScheduledRefresh
            )

        return
    end

    runScheduledRefresh()
end

local function scheduleInitialSync()
    local announce =
        not hasAnnouncedInitialSync

    hasAnnouncedInitialSync =
        true

    scheduleRefresh(
        "entering-world",
        1.5,
        announce
    )
end

local function printCaptureStatus()
    if PT.PrintCurrentProfessionCaptureStatus then
        PT.PrintCurrentProfessionCaptureStatus()
        return
    end

    PT.PrintStatus()
end

local function handleSlashCommand(input)
    local command =
        trimCommand(
            input
        )

    if command == "" then
        PT.PrintStatus()
        return
    end

    if command == "status" then
        printCaptureStatus()
        return
    end

    if command == "sync" then
        clearPendingRefresh()

        PT.RunProfessionRefresh(
            "manual",
            "Manueller Sync",
            true
        )

        return
    end

    PT.Print(
        "Befehle: /st status, /st sync"
    )
end

local function initializeSlashCommands()
    SLASH_PROFESSIONTRACKER1 =
        "/syntrack"

    SLASH_PROFESSIONTRACKER2 =
        "/st"

    SLASH_PROFESSIONTRACKER3 =
        "/professiontracker"

    SLASH_PROFESSIONTRACKER4 =
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

local function handleAutomaticRefresh(event)
    local configuration =
        automaticRefreshEvents[
            event
        ]

    if not configuration then
        return
    end

    scheduleRefresh(
        configuration.reason,
        configuration.delay,
        configuration.announce
    )
end

local function handleLogout()
    clearPendingRefresh()

    PT.RunProfessionRefresh(
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

    if event == "PLAYER_ENTERING_WORLD" then
        scheduleInitialSync()
        return
    end

    if event == "PLAYER_LOGOUT" then
        handleLogout()
        return
    end

    handleAutomaticRefresh(
        event
    )
end

eventFrame:RegisterEvent(
    "ADDON_LOADED"
)

eventFrame:RegisterEvent(
    "PLAYER_ENTERING_WORLD"
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