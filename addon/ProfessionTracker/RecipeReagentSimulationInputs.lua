local _, PT = ...

local MAX_QUALITY_SCENARIOS = 36
local MODIFIED_REAGENT_DATA_SLOT_TYPE = 2

PT.RECIPE_REAGENT_MAX_QUALITY_SCENARIOS =
    MAX_QUALITY_SCENARIOS

local function createScenario(
    plan,
    optionIndexes
)
    local inputs = {}
    local selections = {}
    local qualityScore = 0
    local signatureParts = {}

    for planIndex, plannedSlot in ipairs(
        plan.slots
    ) do
        local optionIndex =
            optionIndexes[planIndex]
            or 1

        local candidate =
            plannedSlot.options[optionIndex]

        local reagentInfo =
            PT.CreateRecipeReagentInfo(
                plannedSlot.slot,
                candidate
            )

        local selection =
            PT.CreateRecipeReagentSelection(
                plannedSlot.slot,
                candidate
            )

        if not reagentInfo
            or not selection
        then
            return nil
        end

        table.insert(inputs, reagentInfo)
        table.insert(selections, selection)

        local signatureValue = "x"

        if type(selection.quality) == "number" then
            qualityScore =
                qualityScore
                + (
                    selection.quality
                    * selection.quantity
                )

            signatureValue =
                tostring(selection.quality)
        end

        table.insert(
            signatureParts,
            tostring(selection.dataSlotIndex)
                .. ":"
                .. signatureValue
                .. ":"
                .. tostring(
                    selection.candidateIndex
                    or 0
                )
        )
    end

    return {
        inputs = inputs,
        selections = selections,
        qualityScore = qualityScore,
        qualitySignature =
            table.concat(
                signatureParts,
                "|"
            )
    }
end

function PT.BuildRecipeReagentSimulationPlan(
    reagentSchema
)
    local plan = {
        slots = {},
        requiredModifiedSlotCount = 0,
        simulatedSlotCount = 0,
        qualitySlotCount = 0,
        combinationCount = 1
    }

    if type(reagentSchema) ~= "table"
        or type(reagentSchema.reagentSlots) ~= "table"
    then
        plan.combinationCount = 0
        return plan
    end

    for _, slot in ipairs(
        reagentSchema.reagentSlots
    ) do
        if type(slot) == "table"
            and slot.required == true
            and slot.dataSlotType
                == MODIFIED_REAGENT_DATA_SLOT_TYPE
        then
            plan.requiredModifiedSlotCount =
                plan.requiredModifiedSlotCount + 1

            local options,
                isQualitySlot =
                PT.GetRecipeReagentSlotOptions(
                    slot
                )

            if #options > 0 then
                plan.simulatedSlotCount =
                    plan.simulatedSlotCount + 1

                if isQualitySlot then
                    plan.qualitySlotCount =
                        plan.qualitySlotCount + 1
                end

                plan.combinationCount =
                    plan.combinationCount
                    * #options

                table.insert(
                    plan.slots,
                    {
                        slot = slot,
                        options = options
                    }
                )
            end
        end
    end

    if plan.requiredModifiedSlotCount == 0 then
        plan.combinationCount = 0
    end

    return plan
end

function PT.BuildRecipeReagentExtremeScenario(
    plan,
    useHighestQuality
)
    if type(plan) ~= "table"
        or type(plan.slots) ~= "table"
    then
        return nil
    end

    local indexes = {}

    for index, plannedSlot in ipairs(
        plan.slots
    ) do
        indexes[index] =
            useHighestQuality
            and #plannedSlot.options
            or 1
    end

    return createScenario(
        plan,
        indexes
    )
end

function PT.BuildRecipeReagentQualityScenarios(
    plan
)
    if type(plan) ~= "table"
        or plan.combinationCount <= 0
        or plan.combinationCount
            > MAX_QUALITY_SCENARIOS
    then
        return {}
    end

    local scenarios = {}
    local indexes = {}

    local function visit(slotIndex)
        if slotIndex > #plan.slots then
            local scenario =
                createScenario(
                    plan,
                    indexes
                )

            if scenario then
                table.insert(
                    scenarios,
                    scenario
                )
            end

            return
        end

        local plannedSlot =
            plan.slots[slotIndex]

        for optionIndex = 1,
            #plannedSlot.options
        do
            indexes[slotIndex] =
                optionIndex

            visit(slotIndex + 1)
        end
    end

    visit(1)

    table.sort(
        scenarios,
        function(left, right)
            if left.qualityScore
                ~= right.qualityScore
            then
                return left.qualityScore
                    < right.qualityScore
            end

            return left.qualitySignature
                < right.qualitySignature
        end
    )

    for index, scenario in ipairs(
        scenarios
    ) do
        scenario.scenarioIndex = index
    end

    return scenarios
end