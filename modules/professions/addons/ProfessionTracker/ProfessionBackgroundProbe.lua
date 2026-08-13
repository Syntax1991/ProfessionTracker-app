local _, PT = ...

local function selectLearnedRecipeIDs(
    recipeProbe
)
    local abilityComplete =
        recipeProbe.abilityEligible > 0
        and recipeProbe.abilityResolved
            == recipeProbe.abilityEligible

    if abilityComplete then
        return recipeProbe
                .abilityLearnedRecipeIDs,
            "ABILITY"
    end

    return recipeProbe
            .directLearnedRecipeIDs,
        "DIRECT"
end

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

    local learnedRecipeIDs,
        learnedSource =
        selectLearnedRecipeIDs(
            recipeProbe
        )

    local operationProbe =
        PT.ProbeBackgroundOperations(
            catalog,
            learnedRecipeIDs
        )

    result.state =
        "PROBED"

    result.recipeTotal =
        recipeProbe.total

    result.recipeResolved =
        recipeProbe.resolved

    result.directLearned =
        recipeProbe.directLearned

    result.abilityEligible =
        recipeProbe.abilityEligible

    result.abilityResolved =
        recipeProbe.abilityResolved

    result.abilityLearned =
        recipeProbe.abilityLearned

    result.learnedSource =
        learnedSource

    result.learnedDetected =
        #learnedRecipeIDs

    result.learnedStored =
        storedRecipeIDs
        and #storedRecipeIDs
        or nil

    result.learnedSetsMatch =
        PT.BackgroundProbeLearnedSetsMatch(
            storedRecipeIDs,
            learnedRecipeIDs
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
                "Context-Free-Probe abgebrochen: Bitte reloggen und vorher keinen Beruf öffnen."
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
            "Context-Free-Probe: Kein Snapshot für den aktuellen Charakter gefunden."
        )

        return nil
    end

    local results = {}

    PT.Print(
        "Context-Free-Probe gestartet · kein TradeSkill-Kontext geladen."
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
            "Context-Free-Probe: Keine unterstützte Crafting-Profession gefunden."
        )

        return results
    end

    PT.PrintBackgroundProbeSummary(
        results
    )

    return results
end