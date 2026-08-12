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

function PT.ProbeBackgroundRecipeInfo(
    catalog
)
    local result = {
        total = 0,
        resolved = 0,
        learned = 0,
        learnedRecipeIDs = {}
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

            local recipeInfo =
                getRecipeInfo(
                    recipeID
                )

            if recipeInfo then
                result.resolved =
                    result.resolved + 1

                if recipeInfo.learned == true then
                    result.learned =
                        result.learned + 1

                    table.insert(
                        result.learnedRecipeIDs,
                        recipeID
                    )
                end
            end
        end
    end

    table.sort(
        result.learnedRecipeIDs
    )

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