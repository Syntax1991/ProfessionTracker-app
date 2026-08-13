local _, PT = ...

PT.TRACKED_PROFESSION_EXPANSION =
    "midnight"

function PT.IsTrackedProfessionExpansionName(
    value
)
    if type(value) ~= "string" then
        return false
    end

    local normalized =
        PT.NormalizeKeyPart(
            value
        )

    return string.find(
        normalized,
        PT.TRACKED_PROFESSION_EXPANSION,
        1,
        true
    ) ~= nil
end

function PT.IsTrackedProfessionExpansion(
    expansion
)
    if type(expansion) ~= "table" then
        return false
    end

    return PT.IsTrackedProfessionExpansionName(
        expansion.expansionName
        or expansion.displayName
    )
end

function PT.IsTrackedProfessionContext(
    context
)
    return PT.IsTrackedProfessionExpansion(
        context
    )
end