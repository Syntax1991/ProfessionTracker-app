local _, PT = ...

function PT.CreateCompactRecipeReagentSchema(
    source
)
    if source == nil then
        return nil
    end

    if PT.EncodeCompactRecipeReagentSchema then
        local encoded =
            PT.EncodeCompactRecipeReagentSchema(
                source
            )

        if encoded then
            return encoded
        end
    end

    return source
end