local _, PT = ...

local simulationOperationKeys = {
    "lowestQualityOperation",
    "highestQualityOperation",
    "highestQualityConcentrationOperation"
}

local function compactSimulationOperations(
    simulation
)
    if type(simulation) ~= "table" then
        return
    end

    for _, key in ipairs(
        simulationOperationKeys
    ) do
        if simulation[key] then
            simulation[key] =
                PT.CreateCompactRecipeOperationMetrics(
                    simulation[key]
                )
        end
    end

    for _, scenario in ipairs(
        simulation.qualityScenarios
        or {}
    ) do
        if type(scenario) == "table"
            and scenario.operationMetrics
        then
            scenario.operationMetrics =
                PT.CreateCompactRecipeOperationMetrics(
                    scenario.operationMetrics
                )
        end
    end
end

local function compactRecipeOperation(
    recipe
)
    if type(recipe) ~= "table" then
        return
    end

    if recipe.operationMetrics then
        recipe.operationMetrics =
            PT.CreateCompactRecipeOperationMetrics(
                recipe.operationMetrics
            )
    end

    compactSimulationOperations(
        recipe.reagentSimulation
    )
end

local function compactCapture(
    capture
)
    if type(capture) ~= "table" then
        return
    end

    for _, recipe in pairs(
        capture.recipes
        or {}
    ) do
        compactRecipeOperation(
            recipe
        )
    end
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