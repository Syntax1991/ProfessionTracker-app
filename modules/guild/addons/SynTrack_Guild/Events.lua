local _, GT = ...

local function handleRosterUpdate()
    local database =
        GT.CaptureRoster(
            "guild-roster-update"
        )

    if not database then
        return
    end

    if GT.NotifyCore then
        GT.NotifyCore(
            "guild-roster-update"
        )
    end
end

local eventFrame =
    CreateFrame("Frame")

eventFrame:RegisterEvent(
    "PLAYER_ENTERING_WORLD"
)

eventFrame:RegisterEvent(
    "GUILD_ROSTER_UPDATE"
)

eventFrame:RegisterEvent(
    "PLAYER_GUILD_UPDATE"
)

eventFrame:SetScript(
    "OnEvent",
    function(_, event)
        if
            event ==
            "PLAYER_ENTERING_WORLD"
        then
            GT.RequestRosterUpdate()
            return
        end

        if
            event ==
            "GUILD_ROSTER_UPDATE"
            or event ==
            "PLAYER_GUILD_UPDATE"
        then
            handleRosterUpdate()
        end
    end
)
