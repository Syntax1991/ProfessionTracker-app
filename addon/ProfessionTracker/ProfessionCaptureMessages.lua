local _, PT = ...

local warnedProfessions = {}
local announcedCaptureSignatures = {}
local loginWarningScheduled = false

local function formatCapturedStatus(status)
    return string.format(
        "%d mit Operation-Daten · %d ohne · %d gelernt",
        status.operationRecipeCount
            or 0,
        status.operationUnavailableCount
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
                .. formatCapturedStatus(
                    status
                )
                .. " · erfasst"
        )

        return
    end

    if status.state == "STALE" then
        PT.Print(
            status.professionName
                .. ": STALE · Datenversion veraltet, Beruf einmal öffnen"
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

    for _, status in ipairs(
        statuses
    ) do
        printProfessionStatus(
            status
        )
    end
end

function PT.WarnMissingProfessionCaptureData()
    for _, status in ipairs(
        PT.GetCurrentProfessionCaptureStatuses()
    ) do
        if status.state ~= "CAPTURED" then
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
                capture.operationUnavailableCount
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
            "%s erfasst · %d mit Operation-Daten · %d ohne · %d gelernt",
            professionName,
            capture.operationRecipeCount
                or 0,
            capture.operationUnavailableCount
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