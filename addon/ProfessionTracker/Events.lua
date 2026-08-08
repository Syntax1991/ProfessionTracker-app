local addonName, PT = ...

local eventFrame =
    CreateFrame("Frame")

local pendingTimer = nil
local pendingReason = nil
local pendingAnnounce = false

local automaticRefreshEvents = {
    PLAYER_LOGIN = {
        reason = "login",
        delay = 1.5,
        announce = true
    },

    PLAYER_ENTERING_WORLD = {
        reason = "entering-world",
        delay = 1.5,
        announce = false
    },

    PLAYER_LEVEL_UP = {
        reason = "level-up",
        delay = 0.5,
        announce = false
    },

    SKILL_LINES_CHANGED = {
        reason = "skill-lines-changed",
        delay = 0.5,
        announce = true
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
    configuration
)
    pendingAnnounce =
        pendingAnnounce
        or configuration.announce
        == true

    pendingReason =
        configuration.reason
        or "automatic"

    cancelPendingTimer()

    if C_Timer
        and C_Timer.NewTimer
    then
        pendingTimer =
            C_Timer.NewTimer(
                configuration.delay
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
        clearPendingRefresh()

        PT.RunProfessionRefresh(
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

    if event == "PLAYER_LOGOUT" then
        handleLogout()
        return
    end

    local configuration =
        automaticRefreshEvents[
            event
        ]

    if configuration then
        scheduleRefresh(
            configuration
        )
    end
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