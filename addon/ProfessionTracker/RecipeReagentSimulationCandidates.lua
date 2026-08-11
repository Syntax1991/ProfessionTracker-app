local _, PT = ...

local function hasReagent(candidate)
    return type(candidate) == "table"
        and (
            type(candidate.itemID) == "number"
            or type(candidate.currencyID) == "number"
        )
end

local function getQualityOptions(candidates)
    local options = {}

    if type(candidates) ~= "table" then
        return options
    end

    for _, candidate in ipairs(candidates) do
        if hasReagent(candidate)
            and type(candidate.quality) == "number"
        then
            table.insert(options, candidate)
        end
    end

    table.sort(
        options,
        function(left, right)
            if left.quality ~= right.quality then
                return left.quality < right.quality
            end

            return (left.candidateIndex or 0)
                < (right.candidateIndex or 0)
        end
    )

    return options
end

local function getFallbackCandidate(candidates)
    if type(candidates) ~= "table" then
        return nil
    end

    for _, candidate in ipairs(candidates) do
        if hasReagent(candidate) then
            return candidate
        end
    end

    return nil
end

function PT.GetRecipeReagentSlotOptions(slot)
    if type(slot) ~= "table" then
        return {}, false
    end

    local qualityOptions =
        getQualityOptions(slot.reagents)

    if #qualityOptions > 0 then
        return qualityOptions, true
    end

    local fallback =
        getFallbackCandidate(slot.reagents)

    if fallback then
        return { fallback }, false
    end

    return {}, false
end

function PT.CreateRecipeReagentInfo(
    slot,
    candidate
)
    if type(slot) ~= "table"
        or not hasReagent(candidate)
        or type(slot.dataSlotIndex) ~= "number"
        or type(slot.quantityRequired) ~= "number"
        or slot.quantityRequired <= 0
    then
        return nil
    end

    local reagent = {}

    if type(candidate.itemID) == "number" then
        reagent.itemID = candidate.itemID
    elseif type(candidate.currencyID) == "number" then
        reagent.currencyID = candidate.currencyID
    end

    return {
        reagent = reagent,
        dataSlotIndex = slot.dataSlotIndex,
        quantity = slot.quantityRequired
    }
end

function PT.CreateRecipeReagentSelection(
    slot,
    candidate
)
    if type(slot) ~= "table"
        or not hasReagent(candidate)
    then
        return nil
    end

    return {
        slotIndex = slot.slotIndex,
        dataSlotIndex = slot.dataSlotIndex,
        candidateIndex = candidate.candidateIndex,
        itemID = candidate.itemID,
        currencyID = candidate.currencyID,
        quality = candidate.quality,
        quantity = slot.quantityRequired
    }
end