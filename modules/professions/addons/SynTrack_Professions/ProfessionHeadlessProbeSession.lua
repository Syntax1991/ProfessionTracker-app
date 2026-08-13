local _, PT = ...

local CHECK_DELAY_SECONDS = 0.35
local CLOSE_DELAY_SECONDS = 0.25
local MAX_CONTEXT_CHECKS = 5

local state = {
    active = false,
    entries = {},
    results = {},
    index = 0,
    openCallSuccess = false,
    openReturned = false
}

local function professionFrameVisible()
    local frame =
        _G.ProfessionsFrame

    return frame
        and frame.IsShown
        and frame:IsShown()
        or false
end

local function getOpenContext()
    if not PT.GetOpenProfessionContext then
        return nil
    end

    return PT.GetOpenProfessionContext()
end

local function closeTradeSkill()
    if not C_TradeSkillUI
        or not C_TradeSkillUI.CloseTradeSkill
    then
        return
    end

    pcall(
        C_TradeSkillUI.CloseTradeSkill
    )
end

local function schedule(
    delay,
    callback
)
    if C_Timer
        and C_Timer.After
    then
        C_Timer.After(
            delay,
            callback
        )

        return
    end

    callback()
end

local function resetState()
    state.active = false
    state.entries = {}
    state.results = {}
    state.index = 0
    state.openCallSuccess = false
    state.openReturned = false
end

function PT.IsHeadlessProfessionProbeActive()
    return state.active == true
end

local function finishProbe()
    closeTradeSkill()

    local results =
        state.results

    PT.PrintHeadlessProbeSummary(
        results
    )

    resetState()
end

local function currentEntry()
    return state.entries[
        state.index
    ]
end

local function openCurrentEntry()
    local entry =
        currentEntry()

    if not entry then
        finishProbe()
        return
    end

    if not C_TradeSkillUI
        or not C_TradeSkillUI.OpenTradeSkill
    then
        PT.Print(
            "Headless-Probe abgebrochen: OpenTradeSkill API fehlt."
        )

        finishProbe()
        return
    end

    local success,
        opened =
        pcall(
            C_TradeSkillUI.OpenTradeSkill,
            entry.profession.skillLineId,
            entry.expansion.skillLineId
        )

    state.openCallSuccess =
        success == true

    state.openReturned =
        success
        and opened == true

    schedule(
        CHECK_DELAY_SECONDS,
        function()
            PT.ContinueHeadlessProfessionProbe(
                1
            )
        end
    )
end

local function advanceProbe(
    abortAfterCurrent
)
    closeTradeSkill()

    if abortAfterCurrent then
        schedule(
            CLOSE_DELAY_SECONDS,
            finishProbe
        )

        return
    end

    state.index =
        state.index + 1

    schedule(
        CLOSE_DELAY_SECONDS,
        openCurrentEntry
    )
end

function PT.ContinueHeadlessProfessionProbe(
    attempt
)
    if not state.active then
        return
    end

    local entry =
        currentEntry()

    if not entry then
        finishProbe()
        return
    end

    local context =
        getOpenContext()

    local contextReady =
        context
        and context.skillLineId
            == entry.expansion.skillLineId

    if not contextReady
        and attempt < MAX_CONTEXT_CHECKS
    then
        schedule(
            CHECK_DELAY_SECONDS,
            function()
                PT.ContinueHeadlessProfessionProbe(
                    attempt + 1
                )
            end
        )

        return
    end

    local uiVisible =
        professionFrameVisible()

    local result =
        PT.BuildHeadlessProbeResult(
            entry,
            state.openCallSuccess,
            state.openReturned,
            context,
            uiVisible
        )

    table.insert(
        state.results,
        result
    )

    PT.PrintHeadlessProbeProfessionResult(
        result
    )

    advanceProbe(
        uiVisible
    )
end

local function initialStateIsSafe()
    if professionFrameVisible() then
        PT.Print(
            "Headless-Probe abgebrochen: Das Profession-Fenster ist bereits sichtbar."
        )

        return false
    end

    if getOpenContext() then
        PT.Print(
            "Headless-Probe abgebrochen: Ein TradeSkill-Kontext ist bereits geladen. Bitte reloggen und vorher keinen Beruf öffnen."
        )

        return false
    end

    return true
end

function PT.RunHeadlessProfessionProbe()
    if state.active then
        PT.Print(
            "Headless-Probe läuft bereits."
        )

        return nil
    end

    if not initialStateIsSafe() then
        return nil
    end

    local entries =
        PT.GetHeadlessProbeEntries()

    if #entries == 0 then
        PT.Print(
            "Headless-Probe: Keine gecapturete Midnight-Crafting-Profession gefunden."
        )

        return nil
    end

    state.active = true
    state.entries = entries
    state.results = {}
    state.index = 1

    PT.Print(
        "Headless-Probe gestartet · kein Profession-Fenster manuell geöffnet."
    )

    openCurrentEntry()

    return true
end