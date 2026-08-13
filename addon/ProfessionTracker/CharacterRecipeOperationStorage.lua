local _, PT = ...

local function createCompactBaseMetrics(
    operationMetrics
)
    if PT.CreateCompactRecipeOperationMetrics then
        return PT.CreateCompactRecipeOperationMetrics(
            operationMetrics
        )
    end

    return operationMetrics
end

function PT.CreateCompactCharacterRecipeOperation(
    recipeID,
    operationMetrics,
    reagentSimulation
)
    if not recipeID then
        return nil
    end

    local compactMetrics =
        createCompactBaseMetrics(
            operationMetrics
        )

    if type(compactMetrics) ~= "table" then
        return nil
    end

    local compactSimulation =
        reagentSimulation

    if PT.CreateCompactCharacterRecipeSimulation then
        compactSimulation =
            PT.CreateCompactCharacterRecipeSimulation(
                compactMetrics,
                reagentSimulation
            )
    end

    return {
        recipeId =
            recipeID,

        operationMetrics =
            compactMetrics,

        reagentSimulation =
            compactSimulation
    }
end

local function compactStoredRecipe(
    recipeKey,
    recipe
)
    if type(recipe) ~= "table" then
        return nil
    end

    local recipeID =
        recipe.recipeId
        or tonumber(
            recipeKey
        )

    if not recipeID then
        return nil
    end

    return PT.CreateCompactCharacterRecipeOperation(
        recipeID,
        recipe.operationMetrics,
        recipe.reagentSimulation
    )
end

local function compactCapture(
    capture
)
    if type(capture) ~= "table" then
        return
    end

    local compactRecipes = {}

    for recipeKey, recipe in pairs(
        capture.recipes
        or {}
    ) do
        local compactRecipe =
            compactStoredRecipe(
                recipeKey,
                recipe
            )

        if compactRecipe then
            compactRecipes[
                tostring(
                    compactRecipe.recipeId
                )
            ] =
                compactRecipe
        else
            compactRecipes[
                recipeKey
            ] =
                recipe
        end
    end

    capture.recipes =
        compactRecipes
end

function PT.CompactCharacterRecipeOperationStorage(
    database
)
    if type(database) ~= "table" then
        return
    end

    for _, captures in pairs(
        database.characterRecipeOperations
        or {}
    ) do
        if type(captures) == "table" then
            for _, capture in pairs(
                captures
            ) do
                compactCapture(
                    capture
                )
            end
        end
    end
end