local _, PT = ...

local LOGIN_DELAY_SECONDS = 6

local reminderScheduled = false
local reminderShown = false

local function joinNames(
    names
)
    table.sort(
        names
    )

    return table.concat(
        names,
        ", "
    )
end

local function collectReminderGroups()
    local missing = {}
    local outdated = {}
    local now =
        time()

    for _, status in ipairs(
        PT.GetCurrentProfessionCaptureStatuses()
    ) do
        local reminderState =
            PT.GetProfessionCaptureReminderState(
                status,
                now
            )

        if reminderState == "MISSING" then
            table.insert(
                missing,
                status.professionName
            )
        elseif reminderState == "OUTDATED" then
            table.insert(
                outdated,
                status.professionName
            )
        end
    end

    return missing,
        outdated
end

local function createMixedContent(
    missing,
    outdated,
    refreshDays
)
    return "SynTrack · Profession-Daten aktualisieren",
        string.format(
            "Öffne diese Berufe einmal:\nFehlende Daten: %s\nÄlter als %d Tage: %s",
            joinNames(
                missing
            ),
            refreshDays,
            joinNames(
                outdated
            )
        ),
        "SynTrack erfasst die Daten beim Öffnen automatisch."
end

local function createMissingContent(
    missing
)
    return "SynTrack · Profession-Daten fehlen",
        string.format(
            "Öffne %s einmal, damit SynTrack die aktuellen Crafting-Daten erfassen kann.",
            joinNames(
                missing
            )
        ),
        "Danach ist kein weiterer Schritt im Addon nötig."
end

local function createOutdatedContent(
    outdated,
    refreshDays
)
    return "SynTrack · Profession-Daten aktualisieren",
        string.format(
            "Öffne %s einmal. Der letzte Crafting-Capture ist älter als %d Tage.",
            joinNames(
                outdated
            ),
            refreshDays
        ),
        "Der vorhandene Snapshot bleibt weiterhin nutzbar."
end

local function createReminderContent(
    missing,
    outdated
)
    local refreshDays =
        PT.PROFESSION_CAPTURE_REFRESH_DAYS
        or 7

    if #missing > 0
        and #outdated > 0
    then
        return createMixedContent(
            missing,
            outdated,
            refreshDays
        )
    end

    if #missing > 0 then
        return createMissingContent(
            missing
        )
    end

    return createOutdatedContent(
        outdated,
        refreshDays
    )
end

function PT.ShowProfessionCaptureReminder()
    if reminderShown then
        return false
    end

    local missing,
        outdated =
        collectReminderGroups()

    if #missing == 0
        and #outdated == 0
    then
        return false
    end

    local title,
        body,
        footer =
        createReminderContent(
            missing,
            outdated
        )

    reminderShown = true

    PT.DisplayProfessionCaptureReminder(
        title,
        body,
        footer
    )

    return true
end

local eventFrame =
    CreateFrame(
        "Frame"
    )

eventFrame:RegisterEvent(
    "PLAYER_ENTERING_WORLD"
)

eventFrame:SetScript(
    "OnEvent",
    function()
        if reminderScheduled then
            return
        end

        reminderScheduled =
            true

        if C_Timer
            and C_Timer.After
        then
            C_Timer.After(
                LOGIN_DELAY_SECONDS,
                PT.ShowProfessionCaptureReminder
            )

            return
        end

        PT.ShowProfessionCaptureReminder()
    end
)