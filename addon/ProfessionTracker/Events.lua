local addonName, PT = ...

local eventFrame =
    CreateFrame("Frame")

local pendingRefreshTimer = nil
local pendingRefreshReason = nil

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

local function runScheduledRefresh()
    local reason =
        pendingRefreshReason
        or "automatic"

    pendingRefreshTimer = nil
    pendingRefreshReason = nil

    refreshCharacter(
        reason
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

        local character =
            refreshCharacter(
                "manual"
            )

        if not character then
            PT.Print(
                "Charakterdaten konnten nicht aktualisiert werden."
            )

            return
        end

        PT.Print(
            string.format(
                "%s-%s manuell aktualisiert. Auto-Sync ist weiterhin aktiv.",
                character.name,
                character.realm
            )
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

local function handleEvent(
    _,
    event,
    argument
)
    if event == "ADDON_LOADED" then
        if argument ~= addonName then
            return
        end

        PT.EnsureDatabase()
        initializeSlashCommands()

        return
    end

    if event == "PLAYER_LOGIN" then
        scheduleRefresh(
            "login",
            1.5
        )

        return
    end

    if event == "PLAYER_ENTERING_WORLD" then
        scheduleRefresh(
            "entering-world",
            1.5
        )

        return
    end

    if event == "PLAYER_LEVEL_UP" then
        scheduleRefresh(
            "level-up",
            0.5
        )

        return
    end

    if event == "SKILL_LINES_CHANGED" then
        scheduleRefresh(
            "skill-lines-changed",
            0.5
        )

        return
    end

    if event == "TRADE_SKILL_SHOW" then
        scheduleRefresh(
            "trade-skill-show",
            0.15
        )

        return
    end

    if event == "TRADE_SKILL_LIST_UPDATE" then
        scheduleRefresh(
            "trade-skill-list-update",
            0.25
        )

        return
    end

    if event == "TRADE_SKILL_DATA_SOURCE_CHANGED" then
        scheduleRefresh(
            "trade-skill-data-source-changed",
            0.25
        )

        return
    end

    if event == "TRAIT_CONFIG_UPDATED" then
        scheduleRefresh(
            "profession-trait-config-updated",
            0.15
        )

        return
    end

    if event == "TRADE_SKILL_CLOSE" then
        scheduleRefresh(
            "trade-skill-close",
            0.25
        )

        return
    end

    if event == "PLAYER_LOGOUT" then
        cancelPendingRefresh()

        refreshCharacter(
            "logout"
        )
    end
end

local events = {
    "ADDON_LOADED",
    "PLAYER_LOGIN",
    "PLAYER_ENTERING_WORLD",
    "PLAYER_LEVEL_UP",
    "SKILL_LINES_CHANGED",
    "TRADE_SKILL_SHOW",
    "TRADE_SKILL_LIST_UPDATE",
    "TRADE_SKILL_DATA_SOURCE_CHANGED",
    "TRAIT_CONFIG_UPDATED",
    "TRADE_SKILL_CLOSE",
    "PLAYER_LOGOUT"
}

for _, event in ipairs(
    events
) do
    eventFrame:RegisterEvent(
        event
    )
end

eventFrame:SetScript(
    "OnEvent",
    handleEvent
)