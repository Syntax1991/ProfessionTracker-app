local _, PT = ...

local function isScalarValue(
    value
)
    local valueType =
        type(value)

    return valueType == "number"
        or valueType == "string"
        or valueType == "boolean"
end

local function copyScalarFields(
    source
)
    local result = {}

    if type(source) ~= "table" then
        return result
    end

    for key, value in pairs(
        source
    ) do
        if type(key) == "string"
            and isScalarValue(
                value
            )
        then
            result[key] =
                value
        end
    end

    return result
end

local function copyReagents(
    source
)
    local result = {}

    if type(source) ~= "table" then
        return result
    end

    for _, reagent in ipairs(
        source
    ) do
        if type(reagent) == "table" then
            table.insert(
                result,
                copyScalarFields(
                    reagent
                )
            )
        end
    end

    return result
end

local function copyReagentSlots(
    source
)
    local result = {}

    if type(source) ~= "table" then
        return result
    end

    for _, slot in ipairs(
        source
    ) do
        if type(slot) == "table" then
            local copiedSlot =
                copyScalarFields(
                    slot
                )

            copiedSlot.reagents =
                copyReagents(
                    slot.reagents
                )

            table.insert(
                result,
                copiedSlot
            )
        end
    end

    return result
end

function PT.GetRecipeReagentSchemaSnapshot(
    recipeID
)
    if not recipeID
        or not C_TradeSkillUI
        or not C_TradeSkillUI.GetRecipeSchematic
    then
        return nil
    end

    local success,
        schematic =
        pcall(
            C_TradeSkillUI.GetRecipeSchematic,
            recipeID,
            false
        )

    if not success
        or type(schematic) ~= "table"
    then
        return nil
    end

    local result =
        copyScalarFields(
            schematic
        )

    local reagentSlots =
        schematic.reagentSlotSchematics
        or schematic.reagentSlots
        or {}

    result.reagentSlots =
        copyReagentSlots(
            reagentSlots
        )

    result.reagentSlotCount =
        #result.reagentSlots

    return result
end