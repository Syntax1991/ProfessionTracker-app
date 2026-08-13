local _, PT = ...

local function getSpellName(
    spellID
)
    if not spellID
        or spellID == 0
    then
        return nil
    end

    if C_Spell
        and C_Spell.GetSpellName
    then
        return C_Spell.GetSpellName(
            spellID
        )
    end

    if GetSpellInfo then
        return GetSpellInfo(
            spellID
        )
    end

    return nil
end

function PT.CopyNumberArray(
    values
)
    local result = {}

    if not values then
        return result
    end

    for _, value in ipairs(
        values
    ) do
        table.insert(
            result,
            value
        )
    end

    return result
end

local function collectDefinition(
    definitionID
)
    if not definitionID
        or definitionID == 0
        or not C_Traits
        or not C_Traits.GetDefinitionInfo
    then
        return nil
    end

    local definitionInfo =
        C_Traits.GetDefinitionInfo(
            definitionID
        )

    if not definitionInfo then
        return nil
    end

    local spellID =
        definitionInfo.spellID
        or definitionInfo.overriddenSpellID

    return {
        definitionId =
            definitionID,
        spellId =
            spellID,
        name =
            definitionInfo.overrideName
            or getSpellName(
                spellID
            ),
        subtext =
            definitionInfo.overrideSubtext,
        description =
            definitionInfo.overrideDescription,
        icon =
            definitionInfo.overrideIcon,
        subType =
            definitionInfo.subType
    }
end

function PT.CollectProfessionTraitEntry(
    configID,
    entryID
)
    if not C_Traits
        or not C_Traits.GetEntryInfo
    then
        return {
            entryId =
                entryID
        }
    end

    local entryInfo =
        C_Traits.GetEntryInfo(
            configID,
            entryID
        )

    if not entryInfo then
        return {
            entryId =
                entryID
        }
    end

    local result = {
        entryId =
            entryID,
        type =
            entryInfo.type,
        maxRanks =
            entryInfo.maxRanks
            or 0,
        isAvailable =
            entryInfo.isAvailable
            == true,
        conditionIds =
            PT.CopyNumberArray(
                entryInfo.conditionIDs
            )
    }

    if not entryInfo.definitionID then
        return result
    end

    result.definitionId =
        entryInfo.definitionID

    local definition =
        collectDefinition(
            entryInfo.definitionID
        )

    if not definition then
        return result
    end

    result.spellId =
        definition.spellId

    result.name =
        definition.name

    result.subtext =
        definition.subtext

    result.description =
        definition.description

    result.icon =
        definition.icon

    result.subType =
        definition.subType

    return result
end