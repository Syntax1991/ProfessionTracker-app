local _, PT = ...

local function getProfessionCount(
    character
)
    if not character
        or type(character.professions) ~= "table"
    then
        return 0
    end

    return #character.professions
end

local function getProfessionLabel(
    professionCount
)
    if professionCount == 1 then
        return "Beruf"
    end

    return "Berufe"
end

local function printSyncCompleted(
    label,
    character
)
    local professionCount =
        getProfessionCount(
            character
        )

    PT.Print(
        string.format(
            "%s abgeschlossen · %s-%s · %d %s aktualisiert.",
            label,
            character.name
                or "Unknown",
            character.realm
                or "Unknown",
            professionCount,
            getProfessionLabel(
                professionCount
            )
        )
    )
end

local function printSyncFailure(
    label,
    errorMessage
)
    if errorMessage then
        PT.Print(
            label
                .. " fehlgeschlagen: "
                .. tostring(
                    errorMessage
                )
        )

        return
    end

    PT.Print(
        label
            .. " fehlgeschlagen."
    )
end

function PT.RunProfessionRefresh(
    reason,
    label,
    announce
)
    label =
        label
        or "Auto-Sync"

    if announce then
        PT.Print(
            label
                .. " gestartet …"
        )
    end

    local success,
        character =
        pcall(
            PT.RefreshCharacter,
            reason
        )

    if not success then
        printSyncFailure(
            label,
            character
        )

        return nil
    end

    if not character then
        printSyncFailure(
            label,
            nil
        )

        return nil
    end

    if announce then
        printSyncCompleted(
            label,
            character
        )
    end

    return character
end