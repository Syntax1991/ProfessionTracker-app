local addonName, PT = ...

local eventFrame =
    CreateFrame("Frame")

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
        local character =
            PT.RefreshCharacter(
                "manual"
            )

        if character then
            PT.Print(
                string.format(
                    "Snapshot für %s-%s aktualisiert. /reload oder Logout schreibt die SavedVariables-Datei.",
                    character.name,
                    character.realm
                )
            )
        else
            PT.Print(
                "Charakterdaten konnten nicht aktualisiert werden."
            )
        end

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
        PT.RefreshCharacter(
            "login"
        )

        return
    end

    if event == "SKILL_LINES_CHANGED" then
        PT.RefreshCharacter(
            "skill-lines-changed"
        )

        return
    end

    if event == "TRADE_SKILL_CLOSE" then
        PT.RefreshCharacter(
            "trade-skill-close"
        )

        return
    end

    if event == "PLAYER_LEVEL_UP" then
        PT.RefreshCharacter(
            "level-up"
        )

        return
    end

    if event == "PLAYER_LOGOUT" then
        PT.RefreshCharacter(
            "logout"
        )
    end
end

eventFrame:RegisterEvent(
    "ADDON_LOADED"
)

eventFrame:RegisterEvent(
    "PLAYER_LOGIN"
)

eventFrame:RegisterEvent(
    "SKILL_LINES_CHANGED"
)

eventFrame:RegisterEvent(
    "TRADE_SKILL_CLOSE"
)

eventFrame:RegisterEvent(
    "PLAYER_LEVEL_UP"
)

eventFrame:RegisterEvent(
    "PLAYER_LOGOUT"
)

eventFrame:SetScript(
    "OnEvent",
    handleEvent
)