local addonName, PT = ...

local eventFrame =
    CreateFrame("Frame")

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

local function getOpenProfessionName()
    if not PT.GetOpenProfessionContext then
        return nil
    end

    local context =
        PT.GetOpenProfessionContext()

    if not context then
        return nil
    end

    return context.displayName
        or context.parentProfessionName
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
        local openProfessionName =
            getOpenProfessionName()

        local character =
            PT.RefreshCharacter(
                "manual"
            )

        if not character then
            PT.Print(
                "Charakterdaten konnten nicht aktualisiert werden."
            )

            return
        end

        if openProfessionName then
            PT.Print(
                string.format(
                    "%s-%s aktualisiert · Spezialisierungs- und Rezeptdaten für %s erfasst. /reload schreibt die SavedVariables-Datei.",
                    character.name,
                    character.realm,
                    openProfessionName
                )
            )

            return
        end

        PT.Print(
            string.format(
                "%s-%s aktualisiert. Für Spezialisierungs- und Rezeptdaten zuerst den gewünschten Beruf öffnen.",
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

local function refreshCharacter(
    reason
)
    PT.RefreshCharacter(
        reason
    )
end

local function handleTraitConfigUpdated(
    configID
)
    if not PT.IsOpenProfessionConfig then
        return
    end

    if not PT.IsOpenProfessionConfig(
        configID
    ) then
        return
    end

    refreshCharacter(
        "profession-trait-config-updated"
    )
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
        refreshCharacter(
            "login"
        )

        return
    end

    if event == "PLAYER_LEVEL_UP" then
        refreshCharacter(
            "level-up"
        )

        return
    end

    if event == "SKILL_LINES_CHANGED" then
        refreshCharacter(
            "skill-lines-changed"
        )

        return
    end

    if event == "TRADE_SKILL_SHOW" then
        refreshCharacter(
            "trade-skill-show"
        )

        return
    end

    if event == "TRADE_SKILL_LIST_UPDATE" then
        refreshCharacter(
            "trade-skill-list-update"
        )

        return
    end

    if event == "TRADE_SKILL_DATA_SOURCE_CHANGED" then
        refreshCharacter(
            "trade-skill-data-source-changed"
        )

        return
    end

    if event == "TRAIT_CONFIG_UPDATED" then
        handleTraitConfigUpdated(
            argument
        )

        return
    end

    if event == "TRADE_SKILL_CLOSE" then
        refreshCharacter(
            "trade-skill-close"
        )

        return
    end

    if event == "PLAYER_LOGOUT" then
        refreshCharacter(
            "logout"
        )
    end
end

local events = {
    "ADDON_LOADED",
    "PLAYER_LOGIN",
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