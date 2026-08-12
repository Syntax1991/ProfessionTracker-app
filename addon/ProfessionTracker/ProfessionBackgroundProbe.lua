local _, PT = ...

local function createProfessionResult(
    profession
)
    local expansion =
        PT.FindMidnightProfessionExpansion
        and PT.FindMidnightProfessionExpansion(
            profession
        )
        or nil

    local result = {
        professionName =
            profession.name
            or "Unknown",

        skillLineID =
            expansion
            and expansion.skillLineId
            or nil,

        state =
            "MISSING_EXPANSION"
    }

    if not expansion
        or not expansion.skillLineId
    then
        return result
    end

    local catalog =
        PT.GetBackgroundProbeRecipeCatalog(
            expansion.skillLineId
        )

    if not catalog
        or type(catalog.recipes) ~= "table"
        or #catalog.recipes == 0
    then
        result.state =
            "MISSING_CATALOG"

        return result
    end

    local recipeProbe =
        PT.ProbeBackgroundRecipeInfo(
            catalog
        )

    local storedRecipeIDs =
        PT.GetBackgroundProbeStoredLearnedRecipeIDs(
            expansion
        )

    local operationProbe =
        PT.ProbeBackgroundOperations(
            catalog,
            recipeProbe.learnedRecipeIDs
        )

    result.state =
        "PROBED"

    result.recipeTotal =
        recipeProbe.total

    result.recipeResolved =
        recipeProbe.resolved

    result.learnedDetected =
        recipeProbe.learned

    result.learnedStored =
        storedRecipeIDs
        and #storedRecipeIDs
        or nil

    result.learnedSetsMatch =
        PT.BackgroundProbeLearnedSetsMatch(
            storedRecipeIDs,
            recipeProbe.learnedRecipeIDs
        )

    result.operationAttempted =
        operationProbe.attempted

    result.operationResolved =
        operationProbe.resolved

    result.simulationAttempted =
        operationProbe.simulationAttempted

    result.simulationResolved =
        operationProbe.simulationResolved

    return result
end

local function shouldProbeProfession(
    profession
)
    if type(profession) ~= "table" then
        return false
    end

    if not PT.IsSupportedCraftingProfession
        or not PT.IsSupportedCraftingProfession(
            profession.skillLineId
        )
    then
        return false
    end

    return (
        profession.skillLevel
        or 0
    ) > 0
end

local function getCurrentCharacter()
    local database =
        PT.EnsureDatabase()

    if not PT.GetCurrentCharacterStorageKey then
        return nil
    end

    local characterKey =
        PT.GetCurrentCharacterStorageKey()

    return database.characters[
        characterKey
    ]
end

function PT.RunBackgroundProfessionProbe()
    if PT.GetOpenProfessionContext then
        local openContext =
            PT.GetOpenProfessionContext()

        if openContext then
            PT.Print(
                "Background-Probe abgebrochen: Bitte zuerst das Profession-Fenster schließen."
            )

            return nil
        end
    end

    local character =
        getCurrentCharacter()

    if not character
        or type(character.professions) ~= "table"
    then
        PT.Print(
            "Background-Probe: Für den aktuellen Charakter wurde noch kein Snapshot gefunden."
        )

        return nil
    end

    local results = {}

    PT.Print(
        "Background-Probe gestartet · Profession-Fenster ist geschlossen."
    )

    for _, profession in ipairs(
        character.professions
    ) do
        if shouldProbeProfession(
            profession
        ) then
            local result =
                createProfessionResult(
                    profession
                )

            table.insert(
                results,
                result
            )

            PT.PrintBackgroundProbeProfessionResult(
                result
            )
        end
    end

    if #results == 0 then
        PT.Print(
            "Background-Probe: Keine unterstützte Crafting-Profession gefunden."
        )

        return results
    end

    PT.PrintBackgroundProbeSummary(
        results
    )

    return results
end