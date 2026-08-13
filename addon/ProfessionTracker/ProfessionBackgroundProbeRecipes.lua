local _, PT = ...

local function getRecipeInfo(
    recipeID
)
    if not C_TradeSkillUI
        or not C_TradeSkillUI.GetRecipeInfo
    then
        return nil
    end

    local success,
        recipeInfo =
        pcall(
            C_TradeSkillUI.GetRecipeInfo,
            recipeID
        )

    if not success
        or type(recipeInfo) ~= "table"
    then
        return nil
    end

    return recipeInfo
end

local function getAbilityRecipeInfo(
    skillLineAbilityID
)
    if not skillLineAbilityID
        or skillLineAbilityID == 0
        or not C_TradeSkillUI
        or not C_TradeSkillUI
            .GetRecipeInfoForSkillLineAbility
    then
        return nil
    end

    local success,
        recipeInfo =
        pcall(
            C_TradeSkillUI
                .GetRecipeInfoForSkillLineAbility,
            skillLineAbilityID
        )

    if not success
        or type(recipeInfo) ~= "table"
    then
        return nil
    end

    return recipeInfo
end

function PT.GetBackgroundProbeRecipeCatalog(
    skillLineID
)
    local database =
        PT.EnsureDatabase()

    return database.recipeCatalog[
        tostring(skillLineID)
    ]
        or database.recipeCatalog[
            skillLineID
        ]
end

function PT.CreateBackgroundProbeRecipeMap(
    catalog
)
    local result = {}

    for _, recipe in ipairs(
        catalog
        and catalog.recipes
        or {}
    ) do
        if recipe.recipeId then
            result[
                recipe.recipeId
            ] =
                recipe
        end
    end

    return result
end

local function createIDSet(
    values
)
    local result = {}

    for _, value in ipairs(
        values
        or {}
    ) do
        result[
            value
        ] = true
    end

    return result
end

function PT.BackgroundProbeLearnedSetsMatch(
    storedRecipeIDs,
    detectedRecipeIDs
)
    if type(storedRecipeIDs) ~= "table" then
        return nil
    end

    local stored =
        createIDSet(
            storedRecipeIDs
        )

    local detected =
        createIDSet(
            detectedRecipeIDs
        )

    for recipeID in pairs(
        stored
    ) do
        if not detected[
            recipeID
        ] then
            return false
        end
    end

    for recipeID in pairs(
        detected
    ) do
        if not stored[
            recipeID
        ] then
            return false
        end
    end

    return true
end

local function addLearnedRecipe(
    result,
    field,
    recipeID,
    recipeInfo
)
    if recipeInfo
        and recipeInfo.learned == true
    then
        result[field] =
            result[field] + 1

        local idField =
            field == "directLearned"
            and "directLearnedRecipeIDs"
            or "abilityLearnedRecipeIDs"

        table.insert(
            result[idField],
            recipeID
        )
    end
end

function PT.ProbeBackgroundRecipeInfo(
    catalog
)
    local result = {
        total = 0,

        resolved = 0,
        directLearned = 0,
        directLearnedRecipeIDs = {},

        abilityEligible = 0,
        abilityResolved = 0,
        abilityLearned = 0,
        abilityLearnedRecipeIDs = {}
    }

    for _, recipe in ipairs(
        catalog
        and catalog.recipes
        or {}
    ) do
        local recipeID =
            recipe.recipeId

        if recipeID then
            result.total =
                result.total + 1

            local directInfo =
                getRecipeInfo(
                    recipeID
                )

            if directInfo then
                result.resolved =
                    result.resolved + 1

                addLearnedRecipe(
                    result,
                    "directLearned",
                    recipeID,
                    directInfo
                )
            end

            local abilityID =
                recipe.skillLineAbilityId

            if abilityID
                and abilityID ~= 0
            then
                result.abilityEligible =
                    result.abilityEligible + 1

                local abilityInfo =
                    getAbilityRecipeInfo(
                        abilityID
                    )

                if abilityInfo then
                    result.abilityResolved =
                        result.abilityResolved + 1

                    addLearnedRecipe(
                        result,
                        "abilityLearned",
                        recipeID,
                        abilityInfo
                    )
                end
            end
        end
    end

    table.sort(
        result.directLearnedRecipeIDs
    )

    table.sort(
        result.abilityLearnedRecipeIDs
    )

    -- Keep the original fields for the existing headless probe.
    result.learned =
        result.directLearned

    result.learnedRecipeIDs =
        result.directLearnedRecipeIDs

    return result
end

function PT.GetBackgroundProbeStoredLearnedRecipeIDs(
    expansion
)
    if not expansion
        or type(expansion.recipeIds) ~= "table"
    then
        return nil
    end

    return expansion.recipeIds
end