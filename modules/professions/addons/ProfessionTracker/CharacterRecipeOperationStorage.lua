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

local function encodeStoredRecipe(
    recipe,
    fallbackRecipeID
)
    if not PT.EncodeCompactCharacterRecipeOperation then
        return recipe
    end

    return PT.EncodeCompactCharacterRecipeOperation(
        recipe,
        fallbackRecipeID
    )
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

    local compactRecipe = {
        recipeId = recipeID,

        operationMetrics =
            compactMetrics,

        reagentSimulation =
            compactSimulation
    }

    return encodeStoredRecipe(
        compactRecipe,
        recipeID
    )
end

local function compactStoredRecipe(
    recipeKey,
    recipe
)
    local recipeID =
        tonumber(recipeKey)

    if type(recipe) == "string" then
        return encodeStoredRecipe(
            recipe,
            recipeID
        ),
        recipeID
    end

    if type(recipe) ~= "table" then
        return nil,
            recipeID
    end

    recipeID =
        recipe.recipeId
        or recipeID

    if not recipeID then
        return nil,
            nil
    end

    local compactRecipe =
        PT.CreateCompactCharacterRecipeOperation(
            recipeID,
            recipe.operationMetrics,
            recipe.reagentSimulation
        )

    return compactRecipe,
        recipeID
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
        local compactRecipe,
            recipeID =
            compactStoredRecipe(
                recipeKey,
                recipe
            )

        if compactRecipe then
            compactRecipes[
                tostring(
                    recipeID
                    or recipeKey
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