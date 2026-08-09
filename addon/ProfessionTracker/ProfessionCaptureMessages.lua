local _, PT = ...

local warnedProfessions = {}
local announcedCaptureSignatures = {}
local loginWarningScheduled = false

local function formatCapturedStatus(status)
    return string.format(
        "%d/%d Operation-Daten · %d ohne Operation-Modell · %d gelernt",
        status.operationRecipeCount
            or 0,
        status.operationEligibleCount
            or 0,
        status.operationExcludedCount
            or 0,
        status.learnedRecipeCount
            or 0
    )
end

local function printProfessionStatus(status)
    if status.state == "CAPTURED" then
        PT.Print(
            status.professionName
                .. ": OPERATIONS · "
                .. formatCapturedStatus(status)
                .. " · erfasst"
        )

        return
    end

    if status.state == "LEGACY" then
        PT.Print(
            status.professionName
                .. ": OPERATIONS · ältere Capture-Version · "
                .. "wird beim nächsten Öffnen automatisch aktualisiert"
        )

        return
    end

    if status.state == "STALE" then
        PT.Print(
            status.professionName
                .. ": STALE · Datenversion unbekannt, Beruf einmal öffnen"
        )

        return
    end

    if status.captureLevel == "RECIPES" then
        PT.Print(
            status.professionName
                .. ": RECIPES · Operation-Erfassung fehlt"
        )

        return
    end

    if status.captureLevel == "EXPANSION" then
        PT.Print(
            status.professionName
                .. ": EXPANSION · Rezeptdetails fehlen"
        )

        return
    end

    PT.Print(
        status.professionName
            .. ": BASIC · Beruf erkannt, Midnight-Details fehlen"
    )
end

function PT.PrintCurrentProfessionCaptureStatus()
    local statuses =
        PT.GetCurrentProfessionCaptureStatuses()

    if #statuses == 0 then
        PT.Print(
            "Keine unterstützten Crafting-Berufe auf diesem Charakter erkannt."
        )

        return
    end

    PT.Print(
        "Crafting-Datenstatus:"
    )

    for _, status in ipairs(statuses) do
        printProfessionStatus(
            status
        )
    end
end

function PT.WarnMissingProfessionCaptureData()
    for _, status in ipairs(
        PT.GetCurrentProfessionCaptureStatuses()
    ) do
        local requiresCapture =
            status.state ~= "CAPTURED"
            and status.state ~= "LEGACY"

        if requiresCapture then
            local warningKey =
                tostring(
                    status.professionSkillLineId
                    or status.professionName
                )

            if not warnedProfessions[
                warningKey
            ] then
                warnedProfessions[
                    warningKey
                ] = true

                PT.Print(
                    status.professionName
                        .. " erkannt, aber Safe-Craft-Daten fehlen. "
                        .. "Öffne den Midnight-Beruf einmal."
                )
            end
        end
    end
end

local function createCaptureSignature(capture)
    return table.concat(
        {
            tostring(
                capture.status
                or "UNKNOWN"
            ),
            tostring(
                capture.operationRecipeCount
                or 0
            ),
            tostring(
                capture.operationEligibleCount
                or 0
            ),
            tostring(
                capture.operationExcludedCount
                or 0
            ),
            tostring(
                capture.learnedRecipeCount
                or 0
            )
        },
        ":"
    )
end

function PT.OnCharacterRecipeOperationsCaptured(
    capture
)
    local captureKey =
        tostring(
            capture.skillLineId
            or "unknown"
        )

    local signature =
        createCaptureSignature(
            capture
        )

    if announcedCaptureSignatures[
        captureKey
    ] == signature
    then
        return
    end

    announcedCaptureSignatures[
        captureKey
    ] =
        signature

    local professionName =
        capture.displayName
        or capture.parentProfessionName
        or "Profession"

    PT.Print(
        string.format(
            "%s erfasst · %d/%d Operation-Daten · %d ohne Operation-Modell · %d gelernt",
            professionName,
            capture.operationRecipeCount
                or 0,
            capture.operationEligibleCount
                or 0,
            capture.operationExcludedCount
                or 0,
            capture.learnedRecipeCount
                or 0
        )
    )
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
        if loginWarningScheduled then
            return
        end

        loginWarningScheduled =
            true

        C_Timer.After(
            4,
            function()
                PT.WarnMissingProfessionCaptureData()
            end
        )
    end
)