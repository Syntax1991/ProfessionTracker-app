local _, PT = ...

local MAX_OPERATION_SAMPLES = 12
local MAX_SIMULATION_SAMPLES = 3

local function shouldProbeOperation(
    recipe
)
    return recipe
        and (
            recipe.operationEligible == true
            or recipe.hasCraftingOperationInfo == true
            or recipe.operationMetrics ~= nil
        )
end

function PT.ProbeBackgroundOperations(
    catalog,
    learnedRecipeIDs
)
    local recipeMap =
        PT.CreateBackgroundProbeRecipeMap(
            catalog
        )

    local result = {
        attempted = 0,
        resolved = 0,
        simulationAttempted = 0,
        simulationResolved = 0
    }

    for _, recipeID in ipairs(
        learnedRecipeIDs
        or {}
    ) do
        if result.attempted
            >= MAX_OPERATION_SAMPLES
        then
            break
        end

        local recipe =
            recipeMap[
                recipeID
            ]

        if shouldProbeOperation(
            recipe
        ) then
            result.attempted =
                result.attempted + 1

            local metrics =
                PT.GetRecipeOperationSnapshot
                and PT.GetRecipeOperationSnapshot(
                    recipeID
                )
                or nil

            if metrics then
                result.resolved =
                    result.resolved + 1

                if result.simulationAttempted
                    < MAX_SIMULATION_SAMPLES
                    and recipe.reagentSchema
                    and PT.GetRecipeReagentSimulationSnapshot
                then
                    result.simulationAttempted =
                        result.simulationAttempted + 1

                    local simulation =
                        PT.GetRecipeReagentSimulationSnapshot(
                            recipeID,
                            recipe.reagentSchema
                        )

                    if simulation then
                        result.simulationResolved =
                            result.simulationResolved + 1
                    end
                end
            end
        end
    end

    return result
end