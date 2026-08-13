local _, PT = ...

local STORAGE_FORMAT = "R1"

PT.RECIPE_REAGENT_SCHEMA_STORAGE_FORMAT =
    STORAGE_FORMAT

local function encodeNumber(value)
    if type(value) == "number" then
        return tostring(value)
    end
    return "x"
end

local function encodeBoolean(value)
    return value == true and "1" or "0"
end

local function splitPlain(value, delimiter)
    local result = {}
    local startIndex = 1

    while true do
        local delimiterIndex =
            string.find(
                value,
                delimiter,
                startIndex,
                true
            )

        if not delimiterIndex then
            table.insert(
                result,
                string.sub(value, startIndex)
            )
            return result
        end

        table.insert(
            result,
            string.sub(
                value,
                startIndex,
                delimiterIndex - 1
            )
        )
        startIndex =
            delimiterIndex + #delimiter
    end
end

local function decodeNumber(value)
    if not value or value == ""
        or value == "x"
    then
        return nil
    end
    return tonumber(value)
end

local function encodeCandidate(candidate, fallbackIndex)
    if type(candidate) ~= "table" then
        return nil
    end

    local itemID = candidate.itemID
    local currencyID = candidate.currencyID

    if type(itemID) ~= "number"
        and type(currencyID) ~= "number"
    then
        return nil
    end

    return table.concat(
        {
            encodeNumber(
                candidate.candidateIndex
                or fallbackIndex
            ),
            encodeNumber(itemID),
            encodeNumber(currencyID),
            encodeNumber(candidate.quality)
        },
        ","
    )
end

local function encodeSlot(slot)
    if type(slot) ~= "table" then
        return nil
    end

    local header =
        table.concat(
            {
                encodeNumber(slot.slotIndex),
                encodeNumber(slot.dataSlotIndex),
                encodeNumber(slot.dataSlotType),
                encodeNumber(slot.reagentType),
                encodeNumber(slot.quantityRequired),
                encodeBoolean(slot.required),
                encodeNumber(slot.orderSource),
                encodeBoolean(
                    slot.hiddenInCraftingForm
                )
            },
            ","
        )

    local candidates = {}

    for index, candidate in ipairs(
        slot.reagents or {}
    ) do
        local encoded =
            encodeCandidate(candidate, index)

        if encoded then
            table.insert(candidates, encoded)
        end
    end

    return header
        .. ":"
        .. table.concat(candidates, "/")
end

function PT.EncodeCompactRecipeReagentSchema(source)
    if type(source) == "string" then
        if string.sub(source, 1, 3)
            == STORAGE_FORMAT .. "|"
        then
            return source
        end
        return nil
    end

    if type(source) ~= "table" then
        return nil
    end

    local header =
        table.concat(
            {
                encodeNumber(source.recipeID),
                encodeNumber(source.recipeType),
                encodeNumber(source.outputItemID),
                encodeNumber(source.quantityMin),
                encodeNumber(source.quantityMax),
                encodeBoolean(
                    source.hasCraftingOperationInfo
                ),
                encodeBoolean(source.isRecraft)
            },
            ","
        )

    local parts = {
        STORAGE_FORMAT,
        header
    }

    for _, slot in ipairs(
        source.reagentSlots
        or source.reagentSlotSchematics
        or {}
    ) do
        local encoded = encodeSlot(slot)

        if encoded then
            table.insert(parts, encoded)
        end
    end

    return table.concat(parts, "|")
end

local function decodeCandidate(value)
    local fields = splitPlain(value, ",")
    local candidateIndex =
        decodeNumber(fields[1])
    local itemID =
        decodeNumber(fields[2])
    local currencyID =
        decodeNumber(fields[3])

    if not candidateIndex
        or (not itemID and not currencyID)
    then
        return nil
    end

    return {
        candidateIndex = candidateIndex,
        itemID = itemID,
        currencyID = currencyID,
        quality = decodeNumber(fields[4])
    }
end

local function decodeCandidates(value)
    local result = {}

    if value == "" then
        return result
    end

    for _, candidateValue in ipairs(
        splitPlain(value, "/")
    ) do
        local candidate =
            decodeCandidate(candidateValue)

        if candidate then
            table.insert(result, candidate)
        end
    end

    return result
end

local function decodeSlot(value)
    local separator =
        string.find(value, ":", 1, true)
    local header =
        separator
        and string.sub(
            value,
            1,
            separator - 1
        )
        or value
    local candidatesValue =
        separator
        and string.sub(value, separator + 1)
        or ""
    local fields = splitPlain(header, ",")
    local slotIndex =
        decodeNumber(fields[1])
    local dataSlotIndex =
        decodeNumber(fields[2])

    if not slotIndex or not dataSlotIndex then
        return nil
    end

    return {
        slotIndex = slotIndex,
        dataSlotIndex = dataSlotIndex,
        dataSlotType =
            decodeNumber(fields[3]),
        reagentType =
            decodeNumber(fields[4]),
        quantityRequired =
            decodeNumber(fields[5]),
        required =
            fields[6] == "1"
            and true
            or nil,
        orderSource =
            decodeNumber(fields[7]),
        hiddenInCraftingForm =
            fields[8] == "1"
            and true
            or nil,
        reagents =
            decodeCandidates(candidatesValue)
    }
end

function PT.DecodeCompactRecipeReagentSchema(source)
    if type(source) == "table" then
        return source
    end

    if type(source) ~= "string" then
        return nil
    end

    local parts = splitPlain(source, "|")

    if parts[1] ~= STORAGE_FORMAT then
        return nil
    end

    local header =
        splitPlain(parts[2] or "", ",")
    local recipeID =
        decodeNumber(header[1])

    if not recipeID then
        return nil
    end

    local reagentSlots = {}

    for index = 3, #parts do
        local slot = decodeSlot(parts[index])

        if slot then
            table.insert(reagentSlots, slot)
        end
    end

    return {
        recipeID = recipeID,
        recipeType =
            decodeNumber(header[2]),
        outputItemID =
            decodeNumber(header[3]),
        quantityMin =
            decodeNumber(header[4]),
        quantityMax =
            decodeNumber(header[5]),
        hasCraftingOperationInfo =
            header[6] == "1"
            and true
            or nil,
        isRecraft =
            header[7] == "1"
            and true
            or nil,
        reagentSlots = reagentSlots
    }
end