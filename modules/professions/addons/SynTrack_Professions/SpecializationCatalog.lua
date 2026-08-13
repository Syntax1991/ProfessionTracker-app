local _, PT = ...

function PT.StoreProfessionCatalog(
    specializationData
)
    if not specializationData
        or not specializationData.skillLineId
        or not PT.IsTrackedProfessionExpansion(
            specializationData
        )
        or not PT.CreateCompactProfessionCatalog
    then
        return
    end

    local catalog =
        PT.CreateCompactProfessionCatalog(
            specializationData
        )

    if not catalog then
        return
    end

    local database =
        PT.EnsureDatabase()

    local catalogKey =
        tostring(
            specializationData.skillLineId
        )

    database.professionCatalog[
        catalogKey
    ] =
        catalog
end