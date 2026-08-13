local _, PT = ...

local function createCompactCandidate(
    candidate,
    fallbackIndex
)
    if type(candidate) ~= "table" then
        return nil
    end

    local hasItem =
        type(candidate.itemID)
            == "number"

    local hasCurrency =
        type(candidate.currencyID)
            == "number"

    if not hasItem
        and not hasCurrency
    then
        return nil
    end

    return {
        candidateIndex =
            candidate.candidateIndex
            or fallbackIndex,

        itemID =
            candidate.itemID,

        currencyID =
            candidate.currencyID,

        quality =
            candidate.quality
    }
end

local function createCompactCandidates(
    candidates
)
    local result = {}

    for index, candidate in ipairs(
        candidates
        or {}
    ) do
        local compactCandidate =
            createCompactCandidate(
                candidate,
                index
            )

        if compactCandidate then
            table.insert(
                result,
                compactCandidate
            )
        end
    end

    return result
end

local function createCompactSlot(
    slot
)
    if type(slot) ~= "table" then
        return nil
    end

    local required =
        slot.required == true
        and true
        or nil

    local hiddenInCraftingForm =
        slot.hiddenInCraftingForm == true
        and true
        or nil

    return {
        slotIndex =
            slot.slotIndex,

        dataSlotIndex =
            slot.dataSlotIndex,

        dataSlotType =
            slot.dataSlotType,

        reagentType =
            slot.reagentType,

        quantityRequired =
            slot.quantityRequired,

        required =
            required,

        orderSource =
            slot.orderSource,

        hiddenInCraftingForm =
            hiddenInCraftingForm,

        reagents =
            createCompactCandidates(
                slot.reagents
            )
    }
end

local function createCompactSlots(
    slots
)
    local result = {}

    for _, slot in ipairs(
        slots
        or {}
    ) do
        local compactSlot =
            createCompactSlot(
                slot
            )

        if compactSlot then
            table.insert(
                result,
                compactSlot
            )
        end
    end

    return result
end

function PT.CreateCompactRecipeReagentSchema(
    source
)
    if type(source) ~= "table" then
        return nil
    end

    local hasCraftingOperationInfo =
        source.hasCraftingOperationInfo == true
        and true
        or nil

    local isRecraft =
        source.isRecraft == true
        and true
        or nil

    return {
        recipeID =
            source.recipeID,

        recipeType =
            source.recipeType,

        outputItemID =
            source.outputItemID,

        quantityMin =
            source.quantityMin,

        quantityMax =
            source.quantityMax,

        hasCraftingOperationInfo =
            hasCraftingOperationInfo,

        isRecraft =
            isRecraft,

        reagentSlots =
            createCompactSlots(
                source.reagentSlots
                or source.reagentSlotSchematics
            )
    }
end