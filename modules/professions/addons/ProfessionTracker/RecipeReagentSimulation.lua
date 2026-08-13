local _, PT = ...

local CAPTURE_VERSION = 2

local function resolveReagentSchema(
    reagentSchema
)
    if type(reagentSchema) ~= "string" then
        return reagentSchema
    end

    if not PT.DecodeCompactRecipeReagentSchema then
        return nil
    end

    return PT.DecodeCompactRecipeReagentSchema(
        reagentSchema
    )
end

local function captureQualityScenario(
    recipeID,
    scenario
)
    local operation =
        PT.GetRecipeOperationSnapshot(
            recipeID,
            scenario.inputs,
            false
        )

    return {
        scenarioIndex =
            scenario.scenarioIndex,

        qualityScore =
            scenario.qualityScore,

        qualitySignature =
            scenario.qualitySignature,

        selections =
            scenario.selections,

        operationMetrics =
            operation
    }
end

local function captureQualityScenarios(
    recipeID,
    plan,
    result
)
    result.qualityScenarioLimit =
        PT.RECIPE_REAGENT_MAX_QUALITY_SCENARIOS
        or 0

    result.qualityScenarioCombinationCount =
        plan.combinationCount

    result.qualityScenarioCapturedCount = 0
    result.qualityScenarios = {}

    if plan.qualitySlotCount == 0 then
        result.qualityScenarioStatus =
            "NO_QUALITY_SLOTS"

        return
    end

    if plan.combinationCount >
        result.qualityScenarioLimit
    then
        result.qualityScenarioStatus =
            "TOO_MANY_COMBINATIONS"

        return
    end

    local scenarios =
        PT.BuildRecipeReagentQualityScenarios(
            plan
        )

    for _, scenario in ipairs(
        scenarios
    ) do
        local captured =
            captureQualityScenario(
                recipeID,
                scenario
            )

        table.insert(
            result.qualityScenarios,
            captured
        )

        if captured.operationMetrics then
            result.qualityScenarioCapturedCount =
                result.qualityScenarioCapturedCount
                + 1
        end
    end

    if result.qualityScenarioCapturedCount ==
        #result.qualityScenarios
    then
        result.qualityScenarioStatus =
            "CAPTURED"
    else
        result.qualityScenarioStatus =
            "PARTIAL"
    end
end

function PT.GetRecipeReagentSimulationSnapshot(
    recipeID,
    reagentSchema
)
    if not recipeID
        or not PT.GetRecipeOperationSnapshot
        or not PT.BuildRecipeReagentSimulationPlan
    then
        return nil
    end

    reagentSchema =
        resolveReagentSchema(
            reagentSchema
        )

    if type(reagentSchema) ~= "table" then
        return nil
    end

    local plan =
        PT.BuildRecipeReagentSimulationPlan(
            reagentSchema
        )

    local result = {
        captureVersion = CAPTURE_VERSION,

        requiredModifiedSlotCount =
            plan.requiredModifiedSlotCount,

        simulatedSlotCount =
            plan.simulatedSlotCount,

        qualitySlotCount =
            plan.qualitySlotCount,

        concentrationCaptured = false,
        qualityScenarioStatus = "UNKNOWN",

        qualityScenarioLimit =
            PT.RECIPE_REAGENT_MAX_QUALITY_SCENARIOS
            or 0,

        qualityScenarioCombinationCount =
            plan.combinationCount,

        qualityScenarioCapturedCount = 0,
        qualityScenarios = {}
    }

    if plan.requiredModifiedSlotCount == 0 then
        result.status =
            "NO_REQUIRED_MODIFIED_REAGENTS"

        result.qualityScenarioStatus =
            "NO_QUALITY_SLOTS"

        return result
    end

    if plan.simulatedSlotCount ~=
        plan.requiredModifiedSlotCount
    then
        result.status =
            "INCOMPLETE_REAGENTS"

        result.qualityScenarioStatus =
            "INCOMPLETE_REAGENTS"

        return result
    end

    local lowestScenario =
        PT.BuildRecipeReagentExtremeScenario(
            plan,
            false
        )

    local highestScenario =
        PT.BuildRecipeReagentExtremeScenario(
            plan,
            true
        )

    if not lowestScenario
        or not highestScenario
    then
        result.status =
            "INCOMPLETE_REAGENTS"

        result.qualityScenarioStatus =
            "INCOMPLETE_REAGENTS"

        return result
    end

    result.lowestQualityOperation =
        PT.GetRecipeOperationSnapshot(
            recipeID,
            lowestScenario.inputs,
            false
        )

    result.highestQualityOperation =
        PT.GetRecipeOperationSnapshot(
            recipeID,
            highestScenario.inputs,
            false
        )

    result.highestQualityConcentrationOperation =
        PT.GetRecipeOperationSnapshot(
            recipeID,
            highestScenario.inputs,
            true
        )

    result.concentrationCaptured =
        result.highestQualityConcentrationOperation
        ~= nil

    if not result.lowestQualityOperation
        or not result.highestQualityOperation
    then
        result.status =
            "OPERATION_UNAVAILABLE"

        result.qualityScenarioStatus =
            "OPERATION_UNAVAILABLE"

        return result
    end

    result.status = "CAPTURED"

    captureQualityScenarios(
        recipeID,
        plan,
        result
    )

    return result
end