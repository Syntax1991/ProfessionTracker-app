local _, PT = ...

local CAPTURE_VERSION = 1

local MODIFIED_REAGENT_DATA_SLOT_TYPE = 2

local function hasReagent(
    candidate
)
    return type(candidate) == "table"
        and (
            type(candidate.itemID) == "number"
            or type(candidate.currencyID) == "number"
        )
end

local function getQuality(
    candidate
)
    if type(candidate) ~= "table"
        or type(candidate.quality) ~= "number"
    then
        return nil
    end

    return candidate.quality
end

local function hasQualityCandidate(
    candidates
)
    if type(candidates) ~= "table" then
        return false
    end

    for _, candidate in ipairs(
        candidates
    ) do
        if getQuality(
            candidate
        ) ~= nil
        then
            return true
        end
    end

    return false
end

local function chooseCandidate(
    candidates,
    useHighestQuality
)
    if type(candidates) ~= "table" then
        return nil
    end

    local selected = nil
    local selectedQuality = nil

    for _, candidate in ipairs(
        candidates
    ) do
        if hasReagent(
            candidate
        ) then
            local quality =
                getQuality(
                    candidate
                )

            if not selected then
                selected =
                    candidate

                selectedQuality =
                    quality
            elseif quality ~= nil then
                local shouldReplace =
                    selectedQuality == nil
                    or (
                        useHighestQuality
                        and quality >
                            selectedQuality
                    )
                    or (
                        not useHighestQuality
                        and quality <
                            selectedQuality
                    )

                if shouldReplace then
                    selected =
                        candidate

                    selectedQuality =
                        quality
                end
            end
        end
    end

    return selected
end

local function createReagentInfo(
    slot,
    candidate
)
    if type(slot) ~= "table"
        or not hasReagent(
            candidate
        )
        or type(slot.dataSlotIndex) ~= "number"
        or type(slot.quantityRequired) ~= "number"
        or slot.quantityRequired <= 0
    then
        return nil
    end

    local reagent = {}

    if type(candidate.itemID) == "number" then
        reagent.itemID =
            candidate.itemID
    elseif type(candidate.currencyID) == "number" then
        reagent.currencyID =
            candidate.currencyID
    end

    return {
        reagent =
            reagent,

        dataSlotIndex =
            slot.dataSlotIndex,

        quantity =
            slot.quantityRequired
    }
end

local function buildSimulationInputs(
    reagentSchema
)
    local lowestQuality = {}
    local highestQuality = {}

    local requiredModifiedSlotCount = 0
    local simulatedSlotCount = 0
    local qualitySlotCount = 0

    if type(reagentSchema) ~= "table"
        or type(reagentSchema.reagentSlots) ~= "table"
    then
        return lowestQuality,
            highestQuality,
            requiredModifiedSlotCount,
            simulatedSlotCount,
            qualitySlotCount
    end

    for _, slot in ipairs(
        reagentSchema.reagentSlots
    ) do
        -- Regular reagent slots are implicit. CraftingReagentInfo allocations
        -- are built only for the modified reagent data slots.
        if type(slot) == "table"
            and slot.required == true
            and slot.dataSlotType ==
                MODIFIED_REAGENT_DATA_SLOT_TYPE
        then
            requiredModifiedSlotCount =
                requiredModifiedSlotCount + 1

            if hasQualityCandidate(
                slot.reagents
            ) then
                qualitySlotCount =
                    qualitySlotCount + 1
            end

            local lowestCandidate =
                chooseCandidate(
                    slot.reagents,
                    false
                )

            local highestCandidate =
                chooseCandidate(
                    slot.reagents,
                    true
                )

            local lowestInfo =
                createReagentInfo(
                    slot,
                    lowestCandidate
                )

            local highestInfo =
                createReagentInfo(
                    slot,
                    highestCandidate
                )

            if lowestInfo
                and highestInfo
            then
                table.insert(
                    lowestQuality,
                    lowestInfo
                )

                table.insert(
                    highestQuality,
                    highestInfo
                )

                simulatedSlotCount =
                    simulatedSlotCount + 1
            end
        end
    end

    return lowestQuality,
        highestQuality,
        requiredModifiedSlotCount,
        simulatedSlotCount,
        qualitySlotCount
end

function PT.GetRecipeReagentSimulationSnapshot(
    recipeID,
    reagentSchema
)
    if not recipeID
        or not PT.GetRecipeOperationSnapshot
    then
        return nil
    end

    local lowestQuality,
        highestQuality,
        requiredModifiedSlotCount,
        simulatedSlotCount,
        qualitySlotCount =
        buildSimulationInputs(
            reagentSchema
        )

    local result = {
        captureVersion =
            CAPTURE_VERSION,

        requiredModifiedSlotCount =
            requiredModifiedSlotCount,

        simulatedSlotCount =
            simulatedSlotCount,

        qualitySlotCount =
            qualitySlotCount,

        concentrationCaptured =
            false
    }

    if requiredModifiedSlotCount == 0 then
        result.status =
            "NO_REQUIRED_MODIFIED_REAGENTS"

        return result
    end

    if simulatedSlotCount ~=
        requiredModifiedSlotCount
    then
        result.status =
            "INCOMPLETE_REAGENTS"

        return result
    end

    local lowestQualityOperation =
        PT.GetRecipeOperationSnapshot(
            recipeID,
            lowestQuality,
            false
        )

    local highestQualityOperation =
        PT.GetRecipeOperationSnapshot(
            recipeID,
            highestQuality,
            false
        )

    local highestQualityConcentrationOperation =
        PT.GetRecipeOperationSnapshot(
            recipeID,
            highestQuality,
            true
        )

    result.lowestQualityOperation =
        lowestQualityOperation

    result.highestQualityOperation =
        highestQualityOperation

    result.highestQualityConcentrationOperation =
        highestQualityConcentrationOperation

    result.concentrationCaptured =
        highestQualityConcentrationOperation
        ~= nil

    if lowestQualityOperation
        and highestQualityOperation
    then
        result.status =
            "CAPTURED"
    else
        result.status =
            "OPERATION_UNAVAILABLE"
    end

    return result
end