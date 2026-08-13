local _, PT = ...

local LOGIN_DELAY_SECONDS = 6

local reminderScheduled = false
local reminderDismissed = false

local function text(
    key
)
    return PT.GetProfessionCaptureLocaleText(
        key
    )
end

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
        return text(
            "TITLE_REFRESH"
        ),
            string.format(
                text(
                    "BODY_MIXED"
                ),
                joinNames(
                    missing
                ),
                refreshDays,
                joinNames(
                    outdated
                )
            ),
            text(
                "FOOTER"
            )
    end

    if #missing > 0 then
        return text(
            "TITLE_MISSING"
        ),
            string.format(
                text(
                    "BODY_MISSING"
                ),
                joinNames(
                    missing
                )
            ),
            text(
                "FOOTER"
            )
    end

    return text(
        "TITLE_REFRESH"
    ),
        string.format(
            text(
                "BODY_OUTDATED"
            ),
            refreshDays,
            joinNames(
                outdated
            )
        ),
        text(
            "FOOTER"
        )
end

function PT.DismissProfessionCaptureReminder()
    reminderDismissed =
        true

    PT.HideProfessionCaptureReminder()
end

function PT.RefreshProfessionCaptureReminder()
    local missing,
        outdated =
        collectReminderGroups()

    if #missing == 0
        and #outdated == 0
    then
        PT.HideProfessionCaptureReminder()

        return false
    end

    if reminderDismissed then
        return false
    end

    local title,
        body,
        footer =
        createReminderContent(
            missing,
            outdated
        )

    PT.DisplayProfessionCaptureReminder(
        title,
        body,
        footer
    )

    return true
end

function PT.ShowProfessionCaptureReminder()
    return PT.RefreshProfessionCaptureReminder()
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