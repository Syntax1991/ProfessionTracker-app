local _, PT = ...

local function getCurrentCharacterKey()
    if not PT.GetCurrentCharacterStorageKey then
        return nil
    end

    return PT.GetCurrentCharacterStorageKey()
end

local function getCurrentCharacter()
    local characterKey =
        getCurrentCharacterKey()

    if not characterKey then
        return nil,
            nil
    end

    local database =
        PT.EnsureDatabase()

    return database.characters[
        characterKey
    ],
        characterKey
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

local function getOperationCapture(
    characterKey,
    skillLineID
)
    if not characterKey
        or not skillLineID
    then
        return nil
    end

    local database =
        PT.EnsureDatabase()

    local captures =
        database.characterRecipeOperations[
            characterKey
        ]

    if type(captures) ~= "table" then
        return nil
    end

    return captures[
        tostring(skillLineID)
    ]
        or captures[
            skillLineID
        ]
end

local function resolveBaseline(
    characterKey,
    expansion
)
    local recipeIDs =
        PT.GetBackgroundProbeStoredLearnedRecipeIDs(
            expansion
        )

    if type(recipeIDs) == "table" then
        return {
            source = "RECIPES",
            count = #recipeIDs,
            recipeIDs = recipeIDs
        }
    end

    local capture =
        getOperationCapture(
            characterKey,
            expansion
                and expansion.skillLineId
        )

    if capture
        and type(
            capture.learnedRecipeCount
        ) == "number"
    then
        return {
            source = "OPERATIONS",
            count =
                capture.learnedRecipeCount,
            recipeIDs = nil
        }
    end

    return {
        source = "NONE",
        count = nil,
        recipeIDs = nil
    }
end

function PT.GetHeadlessProbeEntries()
    local character,
        characterKey =
        getCurrentCharacter()

    local entries = {}

    if not character
        or type(character.professions) ~= "table"
    then
        return entries
    end

    for _, profession in ipairs(
        character.professions
    ) do
        if shouldProbeProfession(
            profession
        ) then
            local expansion =
                PT.FindMidnightProfessionExpansion(
                    profession
                )

            local catalog =
                expansion
                and expansion.skillLineId
                and PT.GetBackgroundProbeRecipeCatalog(
                    expansion.skillLineId
                )
                or nil

            if expansion
                and expansion.skillLineId
                and catalog
                and type(catalog.recipes) == "table"
                and #catalog.recipes > 0
            then
                table.insert(
                    entries,
                    {
                        profession =
                            profession,

                        expansion =
                            expansion,

                        catalog =
                            catalog,

                        baseline =
                            resolveBaseline(
                                characterKey,
                                expansion
                            )
                    }
                )
            end
        end
    end

    table.sort(
        entries,
        function(left, right)
            return (
                left.profession.name
                or ""
            ) < (
                right.profession.name
                or ""
            )
        end
    )

    return entries
end

local function contextMatches(
    entry,
    context
)
    return context
        and context.skillLineId
            == entry.expansion.skillLineId
end

local function resolveBaselineMatch(
    baseline,
    detectedRecipeIDs
)
    if baseline.source == "RECIPES" then
        return PT.BackgroundProbeLearnedSetsMatch(
            baseline.recipeIDs,
            detectedRecipeIDs
        )
    end

    if baseline.source == "OPERATIONS"
        and baseline.count ~= nil
    then
        return #detectedRecipeIDs
            == baseline.count
    end

    return nil
end

function PT.BuildHeadlessProbeResult(
    entry,
    openCallSuccess,
    openReturned,
    context,
    uiVisible
)
    local recipeProbe =
        PT.ProbeBackgroundRecipeInfo(
            entry.catalog
        )

    local operationProbe =
        {
            attempted = 0,
            resolved = 0,
            simulationAttempted = 0,
            simulationResolved = 0
        }

    if contextMatches(
        entry,
        context
    ) then
        operationProbe =
            PT.ProbeBackgroundOperations(
                entry.catalog,
                recipeProbe.learnedRecipeIDs
            )
    end

    return {
        professionName =
            entry.profession.name
            or "Unknown",

        professionSkillLineID =
            entry.profession.skillLineId,

        expansionSkillLineID =
            entry.expansion.skillLineId,

        openCallSuccess =
            openCallSuccess == true,

        openReturned =
            openReturned == true,

        contextReady =
            contextMatches(
                entry,
                context
            ),

        uiVisible =
            uiVisible == true,

        recipeTotal =
            recipeProbe.total,

        recipeResolved =
            recipeProbe.resolved,

        learnedDetected =
            recipeProbe.learned,

        learnedBaseline =
            entry.baseline.count,

        baselineSource =
            entry.baseline.source,

        baselineMatches =
            resolveBaselineMatch(
                entry.baseline,
                recipeProbe.learnedRecipeIDs
            ),

        operationAttempted =
            operationProbe.attempted,

        operationResolved =
            operationProbe.resolved,

        simulationAttempted =
            operationProbe.simulationAttempted,

        simulationResolved =
            operationProbe.simulationResolved
    }
end