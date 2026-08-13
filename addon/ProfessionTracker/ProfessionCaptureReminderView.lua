local _, PT = ...

local DISPLAY_SECONDS = 10

local reminderFrame = nil
local dismissTimer = nil

local function cancelDismissTimer()
    if dismissTimer
        and dismissTimer.Cancel
    then
        dismissTimer:Cancel()
    end

    dismissTimer = nil
end

local function createText(
    frame,
    template
)
    return frame:CreateFontString(
        nil,
        "OVERLAY",
        template
    )
end

local function createReminderFrame()
    local frame =
        CreateFrame(
            "Frame",
            nil,
            UIParent,
            "BackdropTemplate"
        )

    frame:SetSize(
        560,
        132
    )

    frame:SetPoint(
        "TOP",
        UIParent,
        "TOP",
        0,
        -115
    )

    frame:SetFrameStrata(
        "DIALOG"
    )

    frame:SetClampedToScreen(
        true
    )

    frame:SetBackdrop(
        {
            bgFile =
                "Interface\\Buttons\\WHITE8X8",

            edgeFile =
                "Interface\\Buttons\\WHITE8X8",

            edgeSize =
                1
        }
    )

    frame:SetBackdropColor(
        0.035,
        0.03,
        0.055,
        0.96
    )

    frame:SetBackdropBorderColor(
        0.46,
        0.31,
        0.72,
        0.95
    )

    local accent =
        frame:CreateTexture(
            nil,
            "ARTWORK"
        )

    accent:SetPoint(
        "TOPLEFT",
        frame,
        "TOPLEFT",
        0,
        0
    )

    accent:SetPoint(
        "BOTTOMLEFT",
        frame,
        "BOTTOMLEFT",
        0,
        0
    )

    accent:SetWidth(
        4
    )

    accent:SetColorTexture(
        0.55,
        0.35,
        0.9,
        1
    )

    frame.title =
        createText(
            frame,
            "GameFontNormalLarge"
        )

    frame.title:SetPoint(
        "TOPLEFT",
        frame,
        "TOPLEFT",
        18,
        -16
    )

    frame.title:SetPoint(
        "RIGHT",
        frame,
        "RIGHT",
        -42,
        0
    )

    frame.title:SetJustifyH(
        "LEFT"
    )

    frame.body =
        createText(
            frame,
            "GameFontHighlight"
        )

    frame.body:SetPoint(
        "TOPLEFT",
        frame.title,
        "BOTTOMLEFT",
        0,
        -9
    )

    frame.body:SetPoint(
        "RIGHT",
        frame,
        "RIGHT",
        -22,
        0
    )

    frame.body:SetJustifyH(
        "LEFT"
    )

    frame.body:SetJustifyV(
        "TOP"
    )

    frame.footer =
        createText(
            frame,
            "GameFontDisableSmall"
        )

    frame.footer:SetPoint(
        "BOTTOMLEFT",
        frame,
        "BOTTOMLEFT",
        18,
        13
    )

    frame.footer:SetPoint(
        "RIGHT",
        frame,
        "RIGHT",
        -22,
        0
    )

    frame.footer:SetJustifyH(
        "LEFT"
    )

    local closeButton =
        CreateFrame(
            "Button",
            nil,
            frame,
            "UIPanelCloseButton"
        )

    closeButton:SetPoint(
        "TOPRIGHT",
        frame,
        "TOPRIGHT",
        -4,
        -4
    )

    frame:SetScript(
        "OnHide",
        cancelDismissTimer
    )

    frame:Hide()

    return frame
end

local function getReminderFrame()
    if not reminderFrame then
        reminderFrame =
            createReminderFrame()
    end

    return reminderFrame
end

local function scheduleDismiss(
    frame
)
    cancelDismissTimer()

    if not C_Timer
        or not C_Timer.NewTimer
    then
        return
    end

    dismissTimer =
        C_Timer.NewTimer(
            DISPLAY_SECONDS,
            function()
                if frame:IsShown() then
                    frame:Hide()
                end
            end
        )
end

function PT.DisplayProfessionCaptureReminder(
    title,
    body,
    footer
)
    local frame =
        getReminderFrame()

    frame.title:SetText(
        title
    )

    frame.body:SetText(
        body
    )

    frame.footer:SetText(
        footer
    )

    frame:Show()

    scheduleDismiss(
        frame
    )
end

function PT.HideProfessionCaptureReminder()
    if reminderFrame
        and reminderFrame:IsShown()
    then
        reminderFrame:Hide()
    end
end